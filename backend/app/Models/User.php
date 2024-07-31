<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    protected $fillable = [
        'employee_id',
        'employee_name',
        'position',
        'username',
        'password',
        'email',
        'organization',
        'section',
        'role'
    ];

    // protected $hidden = [
    //     'password',
    //     'remember_token',
    // ];
}
