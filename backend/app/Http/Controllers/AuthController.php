<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

use Cloudinary\Cloudinary;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed' 
        ]);

        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password'])
        ]);

        $token = $user->createToken('trackmate_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $fields = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);

        if (!Auth::attempt($fields)) {
            return response()->json(['message' => 'Hibás e-mail vagy jelszó!'], 401);
        }

        $user = User::where('email', $fields['email'])->first();
        $token = $user->createToken('trackmate_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        // Töröljük a jelenlegi tokent
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sikeres kijelentkezés!']);
    }

    public function uploadProfilePicture(Request $request)
    {
        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();

        // 1. Inicializáljuk a Cloudinary-t a .env fájlba beírt linkkel
        $cloudinary = new Cloudinary(env('CLOUDINARY_URL'));

        // 2. Feltöltjük a fájlt a valós elérési útjáról (getRealPath)
        $uploadResult = $cloudinary->uploadApi()->upload(
            $request->file('profile_picture')->getRealPath(),
            ['folder' => 'trackmate_profiles']
        );

        // 3. A válaszból kivesszük a biztonságos URL-t
        $secureUrl = $uploadResult['secure_url'];

        // 4. Elmentjük az adatbázisba
        $user->update([
            'profile_picture' => $secureUrl
        ]);

        return response()->json(['message' => 'Profilkép frissítve!', 'user' => $user]);
    }
}