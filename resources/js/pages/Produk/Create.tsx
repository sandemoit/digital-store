import { useState, useRef, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Editor } from '@tinymce/tinymce-react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

// Types
interface Kategori {
  id: number;
  nama: string;
}

interface ProductFormData {
  name: string;
  deskripsi: string;
  harga: string;
  stok: string;
  gambar: File[];
  id_kategori: string;
  framework: string;
  php_version: string;
  database: string;
  author: string;
  versi: string;
  link_demo: string;
  faq: string;
  is_active: boolean;
  [key: string]: any;
}

// Image preview interface
interface ImagePreview {
  file: File;
  preview: string;
}

// Component for form fields
interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  optional?: boolean;
}

const FormField = ({ label, error, children, optional }: FormFieldProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium">{label}</label>
      {optional && <span className="text-xs text-gray-500">Opsional</span>}
    </div>
    {children}
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

// Component for form sections
interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const FormSection = ({ title, description, children }: FormSectionProps) => (
  <div className="space-y-4 pb-6 border-b border-gray-200 last:border-0">
    <div>
      <h3 className="text-lg font-medium">{title}</h3>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

// Main form component
interface ProductFormProps {
  title: string;
  kategori: Kategori[];
}

const MAX_IMAGES = 10;

const initialData: ProductFormData = {
  name: '', deskripsi: '', harga: '', stok: '', gambar: [],
  id_kategori: '', framework: '', php_version: '', database: '',
  author: '', versi: '', link_demo: '', faq: '', is_active: true,
};

export default function Create({ title, kategori }: ProductFormProps) {
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const { data, setData, post, processing, errors } = useForm<ProductFormData>(initialData);

  // TinyMCE Editor refs
  const deskripsiEditorRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle form submission
  const handleInputChange = (field: keyof ProductFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData(field, e.target.value);
  };

  const handleEditorChange = (field: keyof ProductFormData) => (content: string) => {
    setData(field, content);
  };

  const handleSelectChange = (field: keyof ProductFormData) => (value: string) => {
    setData(field, value);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setData('is_active', checked);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const total = data.gambar.length + files.length;
    if (total > MAX_IMAGES) {
      toast.error('Error', { description: `Maksimal ${MAX_IMAGES} gambar yang dapat diunggah` });
      return;
    }

    const updatedFiles = [...data.gambar, ...files];
    const newPreviews = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setData('gambar', updatedFiles);
    setImagePreviews(prev => [...prev, ...newPreviews]);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = [...data.gambar];
    const updatedPreviews = [...imagePreviews];
    const removedPreview = updatedPreviews.splice(index, 1)[0];
    updatedFiles.splice(index, 1);

    setData('gambar', updatedFiles);
    setImagePreviews(updatedPreviews);
    URL.revokeObjectURL(removedPreview.preview);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'gambar') formData.append(key, value.toString());
    });
    data.gambar.forEach((file, index) => {
      formData.append(`gambar[${index}]`, file);
    });

    post('/produk', {
      data: formData,
      forceFormData: true,
      onSuccess: () => toast.success('Sukses', { description: "Produk berhasil ditambahkan" }),
    });
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview.preview));
    };
  }, []);

  return (
    <AppLayout>
      <Head title={title} />
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">Tambah Produk</h1>
          <p className="text-gray-500">Isi detail informasi produk baru</p>
        </header>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <FormSection
                title="Informasi Dasar"
                description="Masukkan detail utama tentang produk yang akan dijual"
              >
                <FormField label="Nama Produk" error={errors.name}>
                  <Input
                    placeholder="Nama Produk"
                    value={data.name}
                    onChange={handleInputChange('name')}
                  />
                </FormField>

                <FormField label="Deskripsi" error={errors.deskripsi}>
                  <Editor
                    apiKey="esu5z25uowjyn5k82a5wt5d72d8cnaj99cywlqyny4km65wi"
                    onInit={(evt, editor) => deskripsiEditorRef.current = editor}
                    value={data.deskripsi}
                    onEditorChange={(content) => setData('deskripsi', content)}
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Harga" error={errors.harga}>
                    <Input
                      placeholder="Harga"
                      type="number"
                      value={data.harga}
                      onChange={handleInputChange('harga')}
                    />
                  </FormField>

                  <FormField label="Stok" error={errors.stok}>
                    <Input
                      placeholder="Stok"
                      type="number"
                      value={data.stok}
                      onChange={handleInputChange('stok')}
                    />
                  </FormField>
                </div>

                <FormField label="Kategori" error={errors.id_kategori}>
                  <Select value={data.id_kategori} onValueChange={handleSelectChange('id_kategori')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {kategori.map((k) => (
                        <SelectItem key={k.id} value={k.id.toString()}>
                          {k.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </FormSection>

              <FormSection
                title="Gambar Produk"
                description={`Unggah hingga ${MAX_IMAGES} gambar produk (format: jpg, png, jpeg, max 2MB per file)`}
              >
                <div className="space-y-4">
                  <FormField label="Upload Gambar" error={errors.gambar}>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2"
                        disabled={data.gambar.length >= MAX_IMAGES}
                      >
                        <Upload size={16} />
                        <span>Pilih Gambar</span>
                      </Button>
                      <span className="ml-4 text-sm text-gray-500">
                        {data.gambar.length}/{MAX_IMAGES} gambar
                      </span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleFileChange}
                      />
                    </div>
                  </FormField>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                      {imagePreviews.map((image, index) => (
                        <div
                          key={`${image.file.name}-${index}`}
                          className="relative group rounded-md border border-gray-200 overflow-hidden"
                        >
                          <div className="aspect-square w-full">
                            <img
                              src={image.preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-white/80 p-1 rounded-full hover:bg-white shadow-sm"
                          >
                            <X size={14} className="text-gray-700" />
                          </button>
                          <div className="text-xs truncate p-1 bg-gray-50 text-gray-700">
                            {image.file.name}
                          </div>
                        </div>
                      ))}

                      {/* Empty slots indicator */}
                      {Array.from({ length: Math.min(MAX_IMAGES - imagePreviews.length, 5) }).map((_, index) => (
                        <div
                          key={`empty-${index}`}
                          className="aspect-square border border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50"
                        >
                          <ImageIcon size={24} className="text-gray-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormSection>

              <FormSection
                title="Spesifikasi Teknis"
                description="Detail teknis mengenai produk yang akan dijual"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Framework" error={errors.framework} optional>
                    <Input
                      placeholder="Framework"
                      value={data.framework}
                      onChange={handleInputChange('framework')}
                    />
                  </FormField>

                  <FormField label="PHP Version" error={errors.php_version} optional>
                    <Input
                      placeholder="PHP Version"
                      value={data.php_version}
                      onChange={handleInputChange('php_version')}
                    />
                  </FormField>

                  <FormField label="Database" error={errors.database} optional>
                    <Input
                      placeholder="Database"
                      value={data.database}
                      onChange={handleInputChange('database')}
                    />
                  </FormField>

                  <FormField label="Versi" error={errors.versi} optional>
                    <Input
                      placeholder="Versi"
                      value={data.versi}
                      onChange={handleInputChange('versi')}
                    />
                  </FormField>

                  <FormField label="Author" error={errors.author} optional>
                    <Input
                      placeholder="Author"
                      value={data.author}
                      onChange={handleInputChange('author')}
                    />
                  </FormField>

                  <FormField label="Link Demo" error={errors.link_demo} optional>
                    <Input
                      placeholder="Link Demo"
                      value={data.link_demo}
                      onChange={handleInputChange('link_demo')}
                    />
                  </FormField>
                </div>
              </FormSection>

              <FormSection title="FAQ & Status">
                <FormField label="FAQ" error={errors.faq} optional>
                  <Editor
                    apiKey="esu5z25uowjyn5k82a5wt5d72d8cnaj99cywlqyny4km65wi"
                    value={data.faq}
                    init={{
                      height: 250,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                    onEditorChange={(content) => setData('faq', content)}
                  />
                </FormField>

                <FormField label="Status Produk" error={errors.is_active}>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={data.is_active}
                      onCheckedChange={handleCheckboxChange}
                      id="status"
                    />
                    <label htmlFor="status" className="text-sm">Aktif</label>
                  </div>
                </FormField>
              </FormSection>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Menyimpan...' : 'Simpan Produk'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
