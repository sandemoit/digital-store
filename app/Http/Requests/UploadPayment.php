<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadPayment extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Ubah ke true jika semua user bisa upload
        return true;

        // Atau tambahkan logic authorization seperti:
        // return auth()->check(); // Hanya user yang login
        // return $this->user()->can('upload-payment'); // Dengan permission
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'payment_proof' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg',
                'max:2048', // 2MB dalam KB
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'payment_proof.required' => 'Bukti pembayaran harus diupload',
            'payment_proof.image' => 'File harus berupa gambar',
            'payment_proof.mimes' => 'Format file harus JPEG, PNG, atau JPG',
            'payment_proof.max' => 'Ukuran file maksimal 2MB',
        ];
    }
}
