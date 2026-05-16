<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GroupController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->groups);
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $group = Group::create([
            'name' => $fields['name'],
            'join_code' => strtoupper(Str::random(8)),
            'creator_id' => $request->user()->id
        ]);

        $group->users()->attach($request->user()->id);

        return response()->json($group, 201);
    }

    public function show(Group $group, Request $request)
    {
        if (!$group->users->contains($request->user()->id)) {
            return response()->json(['message' => 'Nincs jogosultságod ehhez a csoporthoz!'], 403);
        }

        return response()->json($group->load(['users', 'categories', 'transactions.category', 'transactions.user']));
    }

    public function join(Request $request)
    {
        $fields = $request->validate([
            'join_code' => 'required|string'
        ]);

        $group = Group::where('join_code', strtoupper($fields['join_code']))->first();

        if (!$group) {
            return response()->json(['message' => 'Érvénytelen csatlakozási kód!'], 404);
        }

        if ($group->users->contains($request->user()->id)) { 
            return response()->json(['message' => 'Már tagja vagy ennek a csoportnak!'], 400);
        }

        $group->users()->attach($request->user()->id);

        return response()->json(['message' => 'Sikeres csatlakozás!', 'group' => $group]);
    }

    public function removeMember(Group $group, mixed $userId, Request $request)
    {
        if ($group->creator_id !== $request->user()->id) {
            return response()->json(['message' => 'Csak a csoport létrehozója távolíthat el tagokat!'], 403);
        }

        if ($group->creator_id == $userId) {
            return response()->json(['message' => 'A létrehozó nem távolíthatja el saját magát!'], 400);
        }

        $group->users()->detach($userId);

        return response()->json(['message' => 'Tag sikeresen eltávolítva.']);
    }
}