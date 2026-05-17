<?php

namespace App\Http\Controllers;

use App\Models\TodoList;
use App\Models\Group;
use Illuminate\Http\Request;

class TodoListController extends Controller
{
    public function index(Request $request)
    {
        $fields = $request->validate([
            'group_id' => 'required|exists:groups,id'
        ]);

        $group = Group::findOrFail($fields['group_id']);

        if (!$group->users->contains($request->user()->id)) {
            return response()->json(['message' => 'Nincs jogosultságod!'], 403);
        }

        $lists = TodoList::where('group_id', $group->id)->with('items.assignee')->get();

        return response()->json($lists);
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'group_id' => 'required|exists:groups,id',
            'name' => 'required|string|max:255'
        ]);

        $group = Group::findOrFail($fields['group_id']);

        if (!$group->users->contains($request->user()->id)) {
            return response()->json(['message' => 'Nincs jogosultságod!'], 403);
        }

        $todoList = TodoList::create($fields);

        return response()->json($todoList->load('items.assignee'), 201);
    }

    public function destroy(TodoList $todoList, Request $request)
    {
        $group = $todoList->group;

        if (!$group->users->contains($request->user()->id)) {
            return response()->json(['message' => 'Nincs jogosultságod!'], 403);
        }

        $todoList->delete();

        return response()->json(['message' => 'Lista törölve.']);
    }
}