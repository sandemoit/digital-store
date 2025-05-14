<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KomentarLike extends Model
{
    use HasFactory;

    protected $fillable = [
        'komentar_id',
        'user_id',
    ];

    /**
     * Get the user who liked the comment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the comment that was liked.
     */
    public function komentar(): BelongsTo
    {
        return $this->belongsTo(Komentar::class);
    }
}
