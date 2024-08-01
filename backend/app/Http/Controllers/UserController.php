<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log as SystemLog;
use Carbon\Carbon;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);;
    }

    public function getAuthenticatedUser(Request $request)
    {
        return response()->json($request->user());
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return User::all();
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
            'employee_id' => 'required',
            'employee_name' => 'required',
            'position' => 'required',
            'username' => 'required|unique:users,username',
            'password' => 'required',
            'email' => 'required|email',
            'organization' => 'required',
            'section' => 'required',
            'role' => 'required',
            'remember_me' => 'boolean'
        ], [
            'employee_id.required' => '* กรุณากรอกรหัสผู้ใช้งาน',
            'employee_name.required' => '* กรุณากรอกชื่อเจ้าของบัญชี',
            'position.required' => '* กรุณากรอกตำแหน่ง',
            'username.required' => '* กรุณากรอกชื่อบัญชีผู้ใช้',
            'password.required' => '* กรุณากรอกรหัสผ่าน',
            'email.required' => '* กรุณากรอกอีเมล',
            'organization.required' => '* กรุณาเลือกกอง / สำนัก',
            'section.required' => '* กรุณาเลือกกลุ่มงาน / ฝ่าย',
            'role.required' => '* กรุณาเลือกสถานะ'
        ]);

        try {
            $user = new User([
                'employee_id' => $request->input('employee_id'),
                'employee_name' => $request->input('employee_name'),
                'position' => $request->input('position'),
                'username' => $request->input('username'),
                'password' => Hash::make($request->input('password')),
                'email' => $request->input('email'),
                'organization' => $request->input('organization'),
                'section' => $request->input('section'),
                'role' => $request->input('role'),
                'remember_token' => $request->input('remember_me') ? Str::random(60) : null,
            ]);
            $user->save();

            $authUser = auth()->user();

            Log::create([
                'ip_address' => $request->ip(),
                'logusername' => $authUser ? $authUser->username : 'N/A',
                'logname' => 'บัญชีผู้ใช้: ' . $request->input('username'),
                'message' => 'เพิ่มข้อมูลบัญชีผู้ใช้สำเร็จ',
                'timestamp' => Carbon::now(),
            ]);

            return response()->json([
                'message' => 'เพิ่มข้อมูลบัญชีผู้ใช้สำเร็จ'
            ], 201);
        } catch (\Exception $e) {
            SystemLog::error($e->getMessage());

            Log::create([
                'ip_address' => $request->ip(),
                'logusername' => $authUser ? $authUser->username : 'N/A',
                'logname' => 'บัญชีผู้ใช้: ไม่พบข้อมูลบัญชีผู้ใช้',
                'message' => 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลบัญชีผู้ใช้ (รหัส Error: ' . $e->getCode() . ')',
                'timestamp' => Carbon::now(),
            ]);

            return response()->json([
                'message' => 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        return response()->json([
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'employee_id' => 'required',
            'employee_name' => 'required',
            'position' => 'required',
            'username' => 'required|unique:users,username,' . $id,
            'password' => 'sometimes',
            'email' => 'required',
            'organization' => 'required',
            'section' => 'required',
            'role' => 'required',
            'remember_me' => 'boolean'
        ], [
            'employee_id.required' => '* กรุณากรอกรหัสผู้ใช้งาน',
            'employee_name.required' => '* กรุณากรอกชื่อเจ้าของบัญชี',
            'position.required' => '* กรุณากรอกตำแหน่ง',
            'username.required' => '* กรุณากรอกชื่อบัญชีผู้ใช้',
            'email.required' => '* กรุณากรอกอีเมล',
            'organization.required' => '* กรุณาเลือกกอง / สำนัก',
            'section.required' => '* กรุณาเลือกกลุ่มงาน / ฝ่าย',
            'role.required' => '* กรุณาเลือกสถานะ'
        ]);

        try {
            $user = User::findOrFail($id);
            $user->employee_id = $request->input('employee_id');
            $user->employee_name = $request->input('employee_name');
            $user->position = $request->input('position');
            $user->username = $request->input('username');
            $user->organization = $request->input('organization');
            $user->section = $request->input('section');
            $user->role = $request->input('role');

            if ($request->has('password')) {
                $user->password = Hash::make($request->input('password'));
            }

            if ($request->has('remember_me')) {
                $user->remember_token = $request->input('remember_me') ? Str::random(60) : null;
            }

            $user->save();

            $authUser = auth()->user();

            Log::create([
                'ip_address' => $request->ip(),
                'logusername' => $authUser ? $authUser->username : 'N/A',
                'logname' => 'บัญชีผู้ใช้: ' . $request->input('username'),
                'message' => 'แก้ไขข้อมูลบัญชีผู้ใช้สำเร็จ',
                'timestamp' => Carbon::now(),
            ]);

            return response()->json([
                'message' => 'แก้ไขข้อมูลบัญชีผู้ใช้สำเร็จ'
            ]);
        } catch (\Exception $e) {
            SystemLog::error($e->getMessage());

            Log::create([
                'ip_address' => $request->ip(),
                'logusername' => $authUser ? $authUser->username : 'N/A',
                'logname' => 'บัญชีผู้ใช้: ' . $request->input('username'),
                'message' => 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลบัญชีผู้ใช้ (รหัส Error: ' . $e->getCode() . ')',
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Request $request)
    {
        try {
            $user = User::findOrFail($id);
            $username = $user->username;
            $user->delete();

            $authUser = auth()->user();

            Log::create([
                'ip_address' => $request->ip(),
                'logusername' => $authUser ? $authUser->username : 'N/A',
                'logname' => 'บัญชีผู้ใช้: ' . $username,
                'message' => 'ลบข้อมูลบัญชีผู้ใช้สำเร็จ',
                'timestamp' => Carbon::now(),
            ]);

            return response()->json([
                'message' => 'ลบข้อมูลบัญชีผู้ใช้สำเร็จ'
            ]);
        } catch (\Exception $e) {
            SystemLog::error($e->getMessage());

            Log::create([
                'ip_address' => $request->ip(),
                'logusername' => $authUser ? $authUser->username : 'N/A',
                'logname' => 'บัญชีผู้ใช้: ' . $request->input('username'),
                'message' => 'เกิดข้อผิดพลาดในการลบข้อมูลบัญชีผู้ใช้: (รหัส Error: ' . $e->getCode() . ')',
                'timestamp' => Carbon::now(),
            ]);

            return response()->json([
                'message' => 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
            ], 500);
        }
    }
}
