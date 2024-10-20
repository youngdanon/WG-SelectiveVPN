import axios from 'axios'
import {parseArgs} from "util";
import ini from "ini";
import type {WgConfig} from "./types.ts";
import {groupIpsBySubnet} from "./masks.ts";
import * as fs from "node:fs";


const $api = axios.create()

const CUSTOM_IPS = [
  '140.82.112.21/20',
  '20.199.39.224/32',
  '13.107.5.93/32'
]


const readWgConfig = async (path: string) => {
  const file = fs.readFileSync(path).toString()
  return ini.parse(file) as WgConfig
}

const prepareAllowedIPs = async (allowedIPs: string) => {
  const discordVoiceIps = await groupIpsBySubnet()
  const customIPs = [...CUSTOM_IPS, ...discordVoiceIps].join(', ')


  const prepared = allowedIPs.replace(/\n/g, ', ')
  if (customIPs.length) {
    return prepared.concat(customIPs)
  }
  else {
    return prepared.slice(0, -2)
  }
}

const fullfillAllowedIPs = (config: WgConfig, preparedAllowedIPs: string) => {
  const newConfig = {...config}
  newConfig.Peer.AllowedIPs = preparedAllowedIPs
  return newConfig
}

const saveWgConfig = async (path: string, config: WgConfig) => {
  const iniConfig = ini.stringify(config, {
    whitespace: true,
  })
  const removedQuotes = iniConfig.replaceAll('"', '')

  const newPath = path.replace('.conf', 'new.conf')
  await Bun.write(newPath, removedQuotes)
}

const main = async () => {
  let values: {path: string | undefined}
  try {
    const { values: v } = parseArgs({
    args: Bun.argv,
    options: {
      path: {
          type: 'string',
        },
      },
      strict: true,
      allowPositionals: true,
    });
    values = v
    if (!values.path) {
      throw new Error('Path is required')
    }
  } catch (e) {
    console.error(e)
    return 1
  }



  const conf = await readWgConfig(values.path)


  const {data} = await $api.get<string>('https://antifilter.download/list/allyouneed.lst')
  const preparedAllowedIPs = await prepareAllowedIPs(data)
  const newConfig = fullfillAllowedIPs(conf,  preparedAllowedIPs)
  await saveWgConfig(values.path, newConfig)
  console.log('Done')
}

main();