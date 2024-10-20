# WG-SelectiveVPN

This tool modifies your WireGuard configuration to route traffic through the VPN only for blocked resources (such as Discord, YouTube, etc.). It also includes IP addresses for the Copilot service.

## Usage
1. Download the Windows executable from the [release](https://github.com/youngdanon/WG-SelectiveVPN/tree/master/release) folder.
2. Place your `wg.conf` file in a location on your system.
3. Open a terminal.
4. Run the following command:

    ```bash
    ./wg-selective --path path-to-your-config
    ```

5. The tool will modify your configuration file and save it as `{your-config-name}new.conf` in the same folder.
6. Replace your old configuration file with the new one.

## How it works
The tool adds a new `AllowedIPs` field to peer in the configuration file. This field specifies the IP addresses that should be routed through the VPN.


## Contributing
Feel free to contribute by opening issues or submitting pull requests!