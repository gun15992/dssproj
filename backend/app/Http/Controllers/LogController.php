<?php

namespace App\Http\Controllers;

use App\Models\Log;
use Illuminate\Http\Request;

class LogController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        return Log::all();

        // $logs = Log::paginate(10);
        // return response()->json($logs);
    }

    public function show($id)
    {
        return Log::find($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'ip_address' => 'required',
            'logname' => 'required',
            'message' => 'required|string|max:255',
        ]);

        $log = Log::create([
            'ip_address' => $request->ipaddress,
            'logname' => $request->logname,
            'message' => $request->message,
            'timestamp' => now(),
        ]);

        return response()->json(['message' => 'สร้างประวัติการทำรายการสำเร็จ', 'log' => $log], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'ip_address' => 'required',
            'logname' => 'required',
            'message' => 'required|string|max:255',
        ]);

        $log = Log::find($id);
        if ($log) {
            $log->update([
                'ip_address' => $request->ipaddress,
                'logname' => $request->logname,
                'message' => $request->message,
                'timestamp' => now(),
            ]);
            return response()->json(['message' => 'อัพเดตประวัติการทำรายการสำเร็จ', 'log' => $log]);
        } else {
            return response()->json(['message' => 'ไม่พบประวัติการทำรายการ'], 404);
        }
    }

    public function destroy($id)
    {
        $log = Log::find($id);
        if ($log) {
            $log->delete();
            return response()->json(['message' => 'ลบประวัติการทำรายการสำเร็จ']);
        } else {
            return response()->json(['message' => 'ไม่พบประวัติการทำรายการ'], 404);
        }
    }

    public function clearAllLogs()
    {
        try {
            $count = Log::count();
            if ($count > 0) {
                Log::truncate();
                return response()->json(['message' => 'ล้างประวัติการทำรายการทั้งหมดเรียบร้อย'], 200);
            }
            else {
                return response()->json(['message' => 'ไม่สามารถล้างข้อมูลได้ เนื่องจากไม่พบประวัติการทำรายการ'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'เกิดข้อผิดพลาดในการล้างประวัติการทำรายการ: ' . $e->getMessage()], 500);
        }
    }
}
