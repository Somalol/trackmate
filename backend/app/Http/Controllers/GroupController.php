<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GroupController extends Controller
{
    // A bejelentkezett felhasználó csoportjai
    public function index(Request $request)
    {
        return response()->json($request->user()->groups);
    }

    // Új csoport létrehozása
    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $group = Group::create([
            'name' => $fields['name'],
            'join_code' => strtoupper(Str::random(8)), // Pl: A7F9K2X1
            'creator_id' => $request->user()->id // Javítva
        ]);

        // A létrehozót egyből hozzáadjuk a csoporthoz tagként is
        $group->users()->attach($request->user()->id); // Javítva

        return response()->json($group, 201);
    }

    // Egy csoport részletei (kategóriákkal, tranzakciókkal és tagokkal együtt)
    public function show(Group $group, Request $request)
    {
        // Biztonsági ellenőrzés: benne van-e a felhasználó a csoportban?
        if (!$group->users->contains($request->user()->id)) { // Javítva
            return response()->json(['message' => 'Nincs jogosultságod ehhez a csoporthoz!'], 403);
        }

        return response()->json($group->load(['users', 'categories', 'transactions.category', 'transactions.user']));
    }

    // Csatlakozás kód alapján (Ezt az api.php-ba is be kell majd kötni)
    public function join(Request $request)
    {
        $fields = $request->validate([
            'join_code' => 'required|string'
        ]);

        $group = Group::where('join_code', strtoupper($fields['join_code']))->first();

        if (!$group) {
            return response()->json(['message' => 'Érvénytelen csatlakozási kód!'], 404);
        }

        if ($group->users->contains($request->user()->id)) { // Javítva
            return response()->json(['message' => 'Már tagja vagy ennek a csoportnak!'], 400);
        }

        $group->users()->attach($request->user()->id); // Javítva

        return response()->json(['message' => 'Sikeres csatlakozás!', 'group' => $group]);
    }
}