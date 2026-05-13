<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    // Tranzakció felvitele
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

        // A user_id-t automatikusan a bejelentkezett felhasználótól vesszük
        $fields['user_id'] = $request->user()->id; // Javítva

        $transaction = Transaction::create($fields);

        // Visszaadjuk a mentett tranzakciót a kategória és felhasználó adataival kibővítve
        return response()->json($transaction->load(['category', 'user']), 201);
    }

    // Tranzakció módosítása
    public function update(Request $request, Transaction $transaction)
    {
        // Csak a saját tranzakcióját módosíthatja az ember
        if ($transaction->user_id !== $request->user()->id) { // Javítva
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

    // Tranzakció törlése
    public function destroy(Transaction $transaction, Request $request)
    {
        if ($transaction->user_id !== $request->user()->id) { // Javítva
            return response()->json(['message' => 'Nincs jogosultságod törölni ezt a tételt!'], 403);
        }

        $transaction->delete();
        return response()->json(['message' => 'Tétel sikeresen törölve.']);
    }
}