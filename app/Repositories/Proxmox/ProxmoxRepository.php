<?php

namespace App\Repositories\Proxmox;

use GuzzleHttp\Client;
use App\Models\Node;
use Webmozart\Assert\Assert;
use App\Models\Server;
use Illuminate\Contracts\Foundation\Application;

abstract class DaemonRepository
{
    /**
     * @var Application
     */
    protected $app;

    /**
     * @var Server|null
     */
    protected $server;

    /**
     * @var Node|null
     */
    protected $node;

    /**
     * BaseWingsRepository constructor.
     */
    public function __construct(Application $application)
    {
        $this->app = $application;
    }

    /**
     * Set the server model this request is stemming from.
     *
     * @return $this
     */
    public function setServer(Server $server): static
    {
        $this->server = $server;

        $this->setNode($this->server->node);

        return $this;
    }

    /**
     * Set the node model this request is stemming from.
     *
     * @return $this
     */
    public function setNode(Node $node): static
    {
        $this->node = $node;

        return $this;
    }

    /**
     * Return an instance of the Guzzle HTTP Client to be used for requests.
     */
    public function getHttpClient(array $headers = []): Client
    {
        Assert::isInstanceOf($this->node, Node::class);

        return new Client([
            'base_uri' => $this->node->getConnectionAddress(),
            'timeout' => config('pterodactyl.guzzle.timeout'),
            'connect_timeout' => config('pterodactyl.guzzle.connect_timeout'),
            'headers' => array_merge($headers, [
                'Authorization' => 'Bearer ' . $this->node->getDecryptedKey(),
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ]),
        ]);
    }
}