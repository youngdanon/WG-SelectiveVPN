export interface WgConfig {
  Interface: Interface;
  Peer: Peer;
}

export interface Peer {
  PublicKey: string;
  PresharedKey: string;
  AllowedIPs: string;
  Endpoint: string;
}

export interface Interface {
  PrivateKey: string;
  Address: string;
  DNS: string;
}