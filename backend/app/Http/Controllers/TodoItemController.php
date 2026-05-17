<?php

namespace App\Http\Controllers;

use App\Models\TodoItem;
use App\Models\TodoList;
use Illuminate\Http\Request;

class TodoItemController extends Controller
{
    public function store(Request $request)
    {
        $fields = $request->validate([
            'todo_list_id' => 'required|exists:todo_lists,id',
            'task' => 'required|string|max:255',
            'assigned_user_id' => 'nullable|exists:users,id'
        ]);

        $todoList = TodoList::findOrFail($fields['todo_list_id']);

        if (!$todoList->group->users->contains($request->user()->id)) {
            return response()->json(['message' => 'Nincs jogosultságod!'], 403);
        }

        $item = TodoItem::create($fields);

        return response()->json($item->load('assignee'), 201);
    }

    public function update(Request $request, TodoItem $todoItem)
    {
        if (!$todoItem->todoList->group->users->contains($request->user()->id)) {
            return response()->json(['message' => 'Nincs jogosultságod!'], 403);
        }

        $fields = $request->validate([
            'task' => 'string|max:255',
            'is_completed' => 'boolean',
            'assigned_user_id' => 'nullable|exists:users,id'
        ]);

        $todoItem->update($fields);

        return response()->json($todoItem->load('assignee'));
    }

    public function destroy(TodoItem $todoItem, Request $request)
    {
        if (!$todoItem->todoList->group->users->contains($request->user()->id)) {
            return response()->json(['message' => 'Nincs jogosultságod!'], 403);
        }

        $todoItem->delete();

        return response()->json(['message' => 'Feladat törölve.']);
    }
}