<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PurchaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'supplier_name' => 'nullable|string|max:100',
            'shipping_agency' => 'nullable|string|max:100',
            'shipping_cost' => 'required|numeric|min:0',
            'purchase_date' => 'required|date',
            'products' => 'required|array|min:1',
            'products.*.name' => 'required|string|max:100',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.purchase_price' => 'required|numeric|min:0',
            'products.*.estimated_sale_price' => 'required|numeric|min:0',
            'products.*.category_id' => 'required|exists:categories,id',
            'products.*.description' => 'nullable|string',
        ];
    }
}
