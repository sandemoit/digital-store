import { useState, useRef, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'sonner';
import { ImageIcon, Upload, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Interface untuk tipe data
interface Kategori {
  id: number;
  nama: string;
}

interface GambarProduk {
  id?: number;
  name: string;
  path: string;
}

interface Produk {
  id: number;
  name: string;
  deskripsi: string;
  harga: string | number;
  stok: string | number;
  id_kategori: string;
  framework: string;
  php_version: string;
  database: string;
  author: string;
  versi: string;
  link_demo: string;
  faq: string;
  is_active: boolean;
  gambar: GambarProduk[];
}

interface ImagePreview {
  file?: File;
  preview: string;
  existing?: boolean;
  id?: number;
  nama_file?: string;
}

interface ProductFormData {
  name: string;
  deskripsi: string;
  harga: string | number;
  stok: string | number;
  gambar: File[];
  existing_gambar: number[];
  gambar_to_remove: number[];
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

interface ProductEditProps {
  title: string;
  kategori: Kategori[];
  produk: Produk;
}

export default function Edit({ title, kategori, produk }: ProductEditProps) {
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const MAX_IMAGES = 10;

  const initialFormData: ProductFormData = {
    name: produk.name || '',
    deskripsi: produk.deskripsi || '',
    harga: produk.harga || '',
    stok: produk.stok || '',
    id_kategori: produk.id_kategori?.toString() || '',
    framework: produk.framework || '',
    php_version: produk.php_version || '',
    database: produk.database || '',
    author: produk.author || '',
    versi: produk.versi || '',
    link_demo: produk.link_demo || '',
    faq: produk.faq || '',
    is_active: produk.is_active || false,
    gambar: [],
    existing_gambar: produk.gambar?.map(img => img.id).filter((id): id is number => id !== undefined) || [],
    gambar_to_remove: [],
  };

  const { data, setData, put, processing, errors } = useForm<ProductFormData>(initialFormData);

  const deskripsiEditorRef = useRef<any>(null);
  const faqEditorRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (produk.gambar && produk.gambar.length > 0) {
      const existingImagePreviews = produk.gambar.map(img => ({
        preview: `/storage/${img.path}`,
        existing: true,
        id: img.id,
        nama_file: img.name
      }));
      setImagePreviews(existingImagePreviews);
    }
  }, [produk.gambar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    // Pastikan semua field required terisi
    const requiredFields = ['name', 'harga', 'stok', 'id_kategori'];
    for (const field of requiredFields) {
      if (!data[field] || data[field] === '') {
        toast.error('Error', {
          description: `Field ${field} wajib diisi`,
        });
        return;
      }
    }

    // Append data biasa
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'gambar' && key !== 'existing_gambar' && key !== 'gambar_to_remove') {
        if (value !== null && value !== undefined) {
          // Pastikan boolean is_active terkonversi dengan benar
          if (key === 'is_active') {
            formData.append(key, value ? '1' : '0');
          } else {
            formData.append(key, value.toString());
          }
        }
      }
    });

    // Tambahkan existing gambar yang tidak dihapus
    // Filter existing gambar yang tidak ada di gambar_to_remove
    const validExistingGambar = data.existing_gambar.filter(id =>
      !data.gambar_to_remove.includes(id)
    );

    if (validExistingGambar && validExistingGambar.length > 0) {
      validExistingGambar.forEach((id, index) => {
        formData.append(`existing_gambar[${index}]`, id.toString());
      });
    }

    // Tambahkan gambar yang akan dihapus
    if (data.gambar_to_remove && data.gambar_to_remove.length > 0) {
      data.gambar_to_remove.forEach((id, index) => {
        formData.append(`gambar_to_remove[${index}]`, id.toString());
      });
    }

    // Tambahkan file gambar baru
    if (data.gambar && data.gambar.length > 0) {
      data.gambar.forEach((file, index) => {
        formData.append(`gambar[${index}]`, file);
      });
    }

    put(route('product.update', produk.id), {
      data: formData,
      forceFormData: true,
      onSuccess: () => {
        toast.success('Sukses', {
          description: "Produk berhasil diperbarui",
        });
      },
      onError: (errors) => {
        toast.error('Error', {
          description: "Terjadi kesalahan saat menyimpan produk",
        });
      },
    });
  };

  const handleInputChange = (field: keyof ProductFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData(field, e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const totalImagesCount = imagePreviews.length + files.length;
    if (totalImagesCount > MAX_IMAGES) {
      toast.error('Error', {
        description: `Maksimal ${MAX_IMAGES} gambar yang dapat diunggah`,
      });
      return;
    }

    const updatedFiles = [...data.gambar, ...files];
    setData('gambar', updatedFiles);

    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      existing: false
    }));

    setImagePreviews(prev => [...prev, ...newPreviews]);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveExistingImage = (id: number, index: number) => {
    setData('gambar_to_remove', [...data.gambar_to_remove, id]);
    setData('existing_gambar', data.existing_gambar.filter(imgId => imgId !== id));

    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
  };

  const handleRemoveNewImage = (index: number) => {
    const existingImagesCount = imagePreviews.filter(img => img.existing).length;
    const newImageIndex = index - existingImagesCount;

    const updatedFiles = [...data.gambar];
    updatedFiles.splice(newImageIndex, 1);
    setData('gambar', updatedFiles);

    const updatedPreviews = [...imagePreviews];
    const removedPreview = updatedPreviews.splice(index, 1)[0];
    setImagePreviews(updatedPreviews);

    if (removedPreview.preview && !removedPreview.existing) {
      URL.revokeObjectURL(removedPreview.preview);
    }
  };

  const handleRemoveImage = (index: number) => {
    const imageToRemove = imagePreviews[index];
    imageToRemove.existing && imageToRemove.id
      ? handleRemoveExistingImage(imageToRemove.id, index)
      : handleRemoveNewImage(index);
  };

  const handleSelectChange = (field: keyof ProductFormData) => (value: string) => {
    setData(field, value);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setData('is_active', checked);
  };

  return (
    <AppLayout>
      <Head title={title} />
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-gray-500">Edit informasi produk</p>
        </header>

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <FormSection title="Informasi Dasar">
                <FormField label="Nama Produk" error={errors.name}>
                  <Input
                    placeholder="Nama Produk"
                    value={data.name}
                    onChange={handleInputChange('name')}
                    required
                  />
                </FormField>

                <FormField label="Deskripsi" error={errors.deskripsi}>
                  <Editor
                    apiKey="esu5z25uowjyn5k82a5wt5d72d8cnaj99cywlqyny4km65wi"
                    onInit={(evt, editor) => deskripsiEditorRef.current = editor}
                    initialValue={data.deskripsi}
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
                    onEditorChange={(content) => setData('deskripsi', content)}
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Harga" error={errors.harga}>
                    <Input
                      placeholder="Harga"
                      type="number"
                      value={data.harga}
                      onChange={handleInputChange('harga')}
                      required
                      min="0"
                    />
                  </FormField>

                  <FormField label="Stok" error={errors.stok}>
                    <Input
                      placeholder="Stok"
                      type="number"
                      value={data.stok}
                      onChange={handleInputChange('stok')}
                      required
                      min="0"
                    />
                  </FormField>
                </div>

                <FormField label="Kategori" error={errors.id_kategori}>
                  <Select
                    value={data.id_kategori}
                    onValueChange={handleSelectChange('id_kategori')}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Kategori">
                        {kategori.find((kat) => kat.id.toString() === data.id_kategori)?.nama || "Pilih kategori"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {kategori.map((kat) => (
                        <SelectItem key={kat.id} value={kat.id.toString()}>
                          {kat.nama}
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
                        disabled={imagePreviews.length >= MAX_IMAGES}
                      >
                        <Upload size={16} />
                        <span>Pilih Gambar</span>
                      </Button>
                      <span className="ml-4 text-sm text-gray-500">
                        {imagePreviews.length}/{MAX_IMAGES} gambar
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

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                      {imagePreviews.map((image, index) => (
                        <div
                          key={`image-${index}`}
                          className="relative group rounded-sm border border-gray-200 overflow-hidden"
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
                          <div className="text-xs truncate p-1 bg-gray-50 text-gray-700 flex items-center">
                            {image.existing && (
                              <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs mr-1">
                                Existing
                              </span>
                            )}
                            {image.nama_file || (image.file?.name || 'Image')}
                          </div>
                        </div>
                      ))}

                      {Array.from({ length: Math.min(MAX_IMAGES - imagePreviews.length, 5) }).map((_, index) => (
                        <div
                          key={`empty-${index}`}
                          className="aspect-square border border-dashed border-gray-300 rounded-sm flex items-center justify-center bg-gray-50"
                        >
                          <ImageIcon size={24} className="text-gray-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormSection>

              <FormSection title="Spesifikasi Teknis">
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
                    onInit={(evt, editor) => faqEditorRef.current = editor}
                    initialValue={data.faq}
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

              <div className="flex justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-2"
                  onClick={() => window.history.back()}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Menyimpan...' : 'Update Produk'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}