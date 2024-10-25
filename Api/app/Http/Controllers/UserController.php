<?php

namespace App\Http\Controllers;

use App\Models\User; // Make sure this is the correct model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Import the Log facade

class UserController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'push_token' => 'required|string',
        ]);

        try {
            // Log incoming request data
            Log::info('Incoming request data', $request->all());

            // Check if the user already exists
            $user = User::where('email', $request->input('email'))->first();

            if ($user) {
                // Update the push token if it's different
                if ($user->push_token !== $request->input('push_token')) {
                    $user->push_token = $request->input('push_token');
                    $user->save(); // Save the updated user
                    Log::info('Updated push token for user', ['email' => $user->email]);
                }
                return response()->json($user, 200); // 200 OK
            } else {
                // Create a new user if it doesn't exist
                $user = User::create([
                    'email' => $request->input('email'),
                    'push_token' => $request->input('push_token'),
                ]);
                return response()->json($user, 201); // 201 Created
            }
        } catch (\Exception $e) {
            // Log the error message
            Log::error('Error storing user data: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}






