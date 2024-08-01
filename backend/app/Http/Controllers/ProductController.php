<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log as SystemLog;
use Carbon\Carbon;

Validator::extend('float', function($attribute, $value, $parameters, $validator) {
    return filter_var($value, FILTER_VALIDATE_FLOAT) !== false;
});

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Product::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'oldsn' => 'nullable|string',
            'newsn' => 'required',
            'name' => 'required',
            'brand' => 'required',
            'model' => 'required',
            'modelsn' => 'required',
            'yearsl' => 'required|integer',
            'dateexp' => 'required',
            'price' => 'required|float',
            'organization' => 'required',
            'location' => 'required',
            'detail' => 'nullable|string',
            'description' => 'nullable|string',
            'status' => 'required',
            'category_code' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,ico|max:2048'
        ], [
            'newsn.required' => '* กรุณากรอกหมายเลขครุภัณฑ์ (แบบใหม่)',
            'name.required' => '* กรุณากรอกชื่อครุภัณฑ์',
            'brand.required' => '* กรุณากรอกยี่ห้อ',
            'model.required' => '* กรุณากรอกรุ่น',
            'modelsn.required' => '* กรุณากรอก Serial Number',
            'yearsl.required' => '* กรุณากรอกอายุการใช้งาน',
            'yearsl.integer' => '* กรุณากรอกอายุการใช้งาน หรือ อายุการใช้งานไม่ได้กรอกข้อมูลเป็นตัวเลข',
            'dateexp.required' => '* กรุณากรอกวันที่หมดอายุการใช้งาน',
            'price.required' => '* กรุณากรอกราคา',
            'price.float' => '* ราคาไม่ได้กรอกข้อมูลเป็นตัวเลข',
            'organization.required' => '* กรุณากรอกหน่วยงานที่รับผิดชอบ',
            'location.required' => '* กรุณากรอกสถานที่ตั้ง',
            'status.required' => '* กรุณาเลือกสถานะครุภัณฑ์',
            'category_code.required' => '* กรุณาเลือกประเภทครุภัณฑ์',
            'image.required' => '* กรุณาเลือกรูปภาพของครุภัณฑ์ หรือ ไฟล์รูปภาพที่เลือกไม่ถูกต้อง',
            'image.image' => '* กรุณาเลือกรูปภาพของครุภัณฑ์ หรือ ไฟล์รูปภาพที่เลือกไม่ถูกต้อง',
            'image.mimes' => ' ไฟล์รูปภาพต้องเป็นประเภท jpeg, png, jpg, gif, svg, หรือ ico เท่านั้น',
            'image.max' => ' ขนาดไฟล์รูปภาพต้องไม่เกิน 2048 KB'
        ]);

        try {
            $imageName = Str::random() . '.' . $request->image->getClientOriginalExtension();
            Storage::disk('public')->putFileAs('product/image', $request->image, $imageName);
            Product::create($request->post() + ['image' => $imageName]);

            $authUser = auth()->user();

            Log::create([
                'ip_address' => $request->ip(),
                'logusername' => $authUser ? $authUser->username : 'N/A',
                'logname' => 'ครุภัณฑ์: ' . $request->newsn,
                'message' => 'เพิ่มข้อมูลครุภัณฑ์สำเร็จ',
                'timestamp' => Carbon::now(),
            ]);

            return response()->json([
                'message' => 'เพิ่มข้อมูลครุภัณฑ์สำเร็จ'
            ], 201);
        } catch (\Exception $e) {
            SystemLog::error($e->getMessage());

            Log::create([
                'ip_address' => $request->ip(),
                'logusername' => $authUser ? $authUser->username : 'N/A',
                'logname' => 'ครุภัณฑ์: ไม่พบข้อมูลครุภัณฑ์',
                'message' => 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลบัญชีผู้ใช้ (รหัส Error: ' . $e->getCode() . ')',
                'timestamp' => Carbon::now(),
            ]);

            return response()->json([
                'message' => 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function show(Product $product)
    {
        return response()->json([
            'product' => $product
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'oldsn' => 'nullable|string',
            'newsn' => 'required',
            'name' => 'required',
            'brand' => 'required',
            'model' => 'required',
            'modelsn' => 'required',
            'yearsl' => 'required|integer',
            'dateexp' => 'required',
            'price' => 'required|float',
            'organization' => 'required',
            'location' => 'required',
            'detail' => 'nullable|string',
            'description' => 'nullable|string',
            'status' => 'required',
            'category_code' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,ico|max:2048'
        ], [
            'newsn.required' => '* กรุณากรอกหมายเลขครุภัณฑ์ (แบบใหม่)',
            'name.required' => '* กรุณากรอกชื่อครุภัณฑ์',
            'brand.required' => '* กรุณากรอกยี่ห้อ',
            'model.required' => '* กรุณากรอกรุ่น',
            'modelsn.required' => '* กรุณากรอก Serial Number',
            'yearsl.required' => '* กรุณากรอกอายุการใช้งาน',
            'yearsl.integer' => '* กรุณากรอกอายุการใช้งาน หรือ อายุการใช้งานไม่ได้กรอกข้อมูลเป็นตัวเลข',
            'dateexp.required' => '* กรุณากรอกวันที่หมดอายุการใช้งาน',
            'price.required' => '* กรุณากรอกราคา',
            'price.float' => '* ราคาไม่ได้กรอกข้อมูลเป็นตัวเลข',
            'organization.required' => '* กรุณากรอกหน่วยงานที่รับผิดชอบ',
            'location.required' => '* กรุณากรอกสถานที่ตั้ง',
            'status.required' => '* กรุณาเลือกสถานะครุภัณฑ์',
            'category_code.required' => '* กรุณาเลือกประเภทครุภัณฑ์'
        ]);

        try {
            $product->fill($request->post())->update();
            $authUser = auth()->user();

            if ($request->hasFile('image')) {
                if ($product->image) {
                    $exists = Storage::disk('public')->exists("product/image/{$product->image}");
                    if ($exists) {
                        Storage::disk('public')->delete("product/image/{$product->image}");
                    }
                }

                $imageName = Str::random() . '.' . $request->image->getClientOriginalExtension();
                Storage::disk('public')->putFileAs('product/image', $request->image, $imageName);
                $product->image = $imageName;
                $product->save();

                Log::create([
                    'ip_address' => $request->ip(),
                    'logusername' => $authUser ? $authUser->username : 'N/A',
                    'logname' => 'ครุภัณฑ์: ' . $request->newsn,
                    'message' => 'แก้ไขข้อมูลครุภัณฑ์สำเร็จ (พร้อมเปลี่ยนภาพ)',
                    'timestamp' => Carbon::now(),
                ]);

                return response()->json([
                    'message' => 'แก้ไขข้อมูลครุภัณฑ์สำเร็จ'
                ]);
            } else {
                Log::create([
                    'ip_address' => $request->ip(),
                    'logusername' => $authUser ? $authUser->username : 'N/A',
                    'logname' => 'ครุภัณฑ์: ' . $request->newsn,
                    'message' => 'แก้ไขข้อมูลครุภัณฑ์สำเร็จ (ไม่เปลี่ยนภาพ)',
                    'timestamp' => Carbon::now(),
                ]);

                return response()->json([
                    'message' => 'แก้ไขข้อมูลครุภัณฑ์สำเร็จ'
                ]);
            }
        } catch (\Exception $e) {
            SystemLog::error($e->getMessage());

            Log::create([
                'ip_address' => $request->ip(),
                'logusername' => $authUser ? $authUser->username : 'N/A',
                'logname' => 'ครุภัณฑ์: ' . $request->newsn,
                'message' => 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลครุภัณฑ์ (รหัส Error: ' . $e->getCode() . ')',
                'timestamp' => Carbon::now(),
            ]);

            return response()->json([
                'message' => 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy(Product $product, Request $request)
    {
        try {
            if ($product->image) {
                $exists = Storage::disk('public')->exists("product/image/{$product->image}");
                if ($exists) {
                    Storage::disk('public')->delete("product/image/{$product->image}");
                }
            }

            $product->delete();

            $authUser = auth()->user();

            Log::create([
                'ip_address' => $request->ip(),
                'logusername' => $authUser ? $authUser->username : 'N/A',
                'logname' => 'ครุภัณฑ์: ' . $product->newsn,
                'message' => 'ลบข้อมูลครุภัณฑ์สำเร็จ',
                'timestamp' => Carbon::now(),
            ]);

            return response()->json([
                'message' => 'ลบข้อมูลครุภัณฑ์สำเร็จ'
            ]);
        } catch (\Exception $e) {
            SystemLog::error($e->getMessage());

            Log::create([
                'ip_address' => $request->ip(),
                'logusername' => $authUser ? $authUser->username : 'N/A',
                'logname' => 'ครุภัณฑ์: ' . $request->newsn,
                'message' => 'เกิดข้อผิดพลาดในการลบข้อมูลครุภัณฑ์ (รหัส Error: ' . $e->getCode() . ')',
                'timestamp' => Carbon::now(),
            ]);

            return response()->json([
                'message' => 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
            ], 500);
        }
    }
}
