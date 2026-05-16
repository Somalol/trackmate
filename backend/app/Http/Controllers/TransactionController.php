<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function store(Request $request)
    {
        $fields = $request->validate([
            'group_id' => 'required|exists:groups,id',
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|in:income,expense',
            'amount' => 'required|integer|min:1',
            'title' => 'required|string|max:255',
            'note' => 'nullable|string',
            'transaction_date' => 'required|date'
        ]);

        $fields['user_id'] = $request->user()->id;

        $transaction = Transaction::create($fields);

        return response()->json($transaction->load(['category', 'user']), 201);
    }

    public function update(Request $request, Transaction $transaction)
    {
        if ($transaction->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Nincs jogosultságod módosítani ezt a tételt!'], 403);
        }

        $fields = $request->validate([
            'category_id' => 'exists:categories,id',
            'type' => 'in:income,expense',
            'amount' => 'integer|min:1',
            'title' => 'string|max:255',
            'note' => 'nullable|string',
            'transaction_date' => 'date'
        ]);

        $transaction->update($fields);

        return response()->json($transaction->load(['category', 'user']));
    }

    public function destroy(Transaction $transaction, Request $request)
    {
        if ($transaction->user_id !== $request->user()->id) { 
            return response()->json(['message' => 'Nincs jogosultságod törölni ezt a tételt!'], 403);
        }

        $transaction->delete();
        return response()->json(['message' => 'Tétel sikeresen törölve.']);
    }
}