<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $groupId = $request->query('group_id');

        $categories = Category::whereNull('group_id')
            ->orWhere('group_id', $groupId)
            ->get();

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'group_id' => 'required|exists:groups,id'
        ]);

        $category = Category::create($fields);

        return response()->json($category, 201);
    }

    public function destroy(Category $category)
    {
        if (is_null($category->group_id)) {
            return response()->json(['message' => 'Alapértelmezett kategória nem törölhető!'], 403);
        }

        $category->delete();
        return response()->json(['message' => 'Kategória törölve.']);
    }
}