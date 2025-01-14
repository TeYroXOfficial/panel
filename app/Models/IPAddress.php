<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IPAddress extends Model
{
    use HasFactory;

    protected $table = 'ip_addresses';

    protected $fillable = ['server_id', 'node_id', 'address', 'cidr', 'gateway', 'mac_address', 'type'];

    public function node()
    {
        return $this->belongsTo(Node::class);
    }
}
