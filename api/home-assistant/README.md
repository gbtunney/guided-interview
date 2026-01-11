# 🏠 Home Assistant

## Core Interface & Tools

- [DEVTOOLS – Home Assistant](http://homeassistant.local:8123/developer-tools/yaml)
- [VS CODE – Home Assistant](http://homeassistant.local:8123/a0d7b954_vscode/ingress)

## Configuration & Settings

- [SETTINGS – Home Assistant](http://homeassistant.local:8123/config/dashboard)
- [SYSTEM – Home Assistant](http://homeassistant.local:8123/config/system)
- [HELPERS – Home Assistant](http://homeassistant.local:8123/config/helpers)
- [ENTITIES – Home Assistant](http://homeassistant.local:8123/config/entities)
- [LABELS – Home Assistant](http://homeassistant.local:8123/config/labels)
- [AUTOMATIONS – Home Assistant](http://homeassistant.local:8123/config/automation/dashboard)
- [SCRIPTS – Home Assistant](http://homeassistant.local:8123/config/script/dashboard)
- [INTEGRATIONS – Home Assistant](http://homeassistant.local:8123/config/integrations/dashboard)

## Dashboards

- [DASHBOARD STAGING – Home Assistant](http://homeassistant.local:8123/real-staging/0)
- [Local Dev Dashboard](http://localhost:5173/local/ha-dashboard/)

## ESPHome

- [ESPHOME – Home Assistant](http://homeassistant.local:8123/hassio/ingress/5c53de3b_esphome)
- [ESPHome Web Flash Tool](https://web.esphome.io/)
- [Getting Started with ESPHome and Home Assistant](http://homeassistant.local:8123/)

## Community & Custom Components

- [Xiaomi BLE Thermometer Integration – PVVX Firmware](https://community.home-assistant.io/t/xiaomi-temperature-humidity-sensor-home-assistant-integration-pvvx-custom-firmware-may-2023/572569/9)
- [Peering Xiaomi BLE with ESP32 Proxy](https://community.home-assistant.io/t/peering-xiaomi-ble-thermometer-with-esp32-ble-proxy-no-clue/640799)
- [Dallas Sensor Not Found – ESPHome Error](https://community.home-assistant.io/t/dallas-sensor-not-found-esphome-error/514880/10)

## Misc

- [Too much History - Logging Issue](https://community.home-assistant.io/t/too-much-history-or-the-logging-problem/302770)

- [homeassistant: manage local media](https://www.home-assistant.io/more-info/local-media/setup-media/)

```sh
#ssh then ssh into container
ssh -t root@homeassistant.local -p 22222 "docker exec -it homeassistant /bin/bash"
```

```sh
docker run -d --name="home-assistant" \
  -v /PATH_TO_YOUR_CONFIG:/config \
  -v /PATH_TO_YOUR_MEDIA:/media \
  -v /etc/localtime:/etc/localtime:ro \
  --net=host \
  s ghcr.io/home-assistant/home-assistant:stable
```

## fix for busted home assistant things

```shell
docker pull docker pull ghcr.io/esphome/esphome-hassio:2024.10.1
# get the name of pulled image
docker image ls -l
# save the image and upload via ssh
docker save ghcr.io/esphome/esphome-hassio | ssh -C root@homeassistant.local -p 22222 docker load
```

```json
{
  "result": [
    {
      "active_time": 1732849343,
      "bind_space_id": "187894467",
      "category": "cz",
      "create_time": 1589745613,
      "custom_name": "Hallway String Lights",
      "icon": "smart/icon/ay1519551146071pEnBd/6a8e9ecf2c758b44aed415218b38c499.png",
      "id": "60785480d8f15be61483",
      "ip": "74.77.113.179",
      "is_online": true,
      "lat": "42.9532"
    }
  ]
}
```

# Home Assistant Sheets — Headers and Meta Formulas

## Entities (Derived) — CSV for A1

```text
entity_id,platform,device_id,name (raw),original_name,area_id,labels,customize,friendly_name,icon,hidden,YAML
```

Optional spill formulas (enter each into row 2 of the specified column). These
pull values from “Entities (norm)” by matching on entity_id.

- B2 (platform)

```text
=ARRAYFORMULA(IF($A2:$A="","",
  XLOOKUP($A2:$A,'Entities (norm)'!$A:$A,INDEX('Entities (norm)'!$A:$ZZ,0,MATCH("platform",'Entities (norm)'!$1:$1,0)))
))
```

- C2 (device_id)

```text
=ARRAYFORMULA(IF($A2:$A="","",
  XLOOKUP($A2:$A,'Entities (norm)'!$A:$A,INDEX('Entities (norm)'!$A:$ZZ,0,MATCH("device_id",'Entities (norm)'!$1:$1,0)))
))
```

- D2 (name (raw))

```text
=ARRAYFORMULA(IF($A2:$A="","",
  XLOOKUP($A2:$A,'Entities (norm)'!$A:$A,INDEX('Entities (norm)'!$A:$ZZ,0,MATCH("name",'Entities (norm)'!$1:$1,0)))
))
```

- E2 (original_name)

```text
=ARRAYFORMULA(IF($A2:$A="","",
  XLOOKUP($A2:$A,'Entities (norm)'!$A:$A,INDEX('Entities (norm)'!$A:$ZZ,0,MATCH("original_name",'Entities (norm)'!$1:$1,0)))
))
```

- F2 (area_id)

```text
=ARRAYFORMULA(IF($A2:$A="","",
  XLOOKUP($A2:$A,'Entities (norm)'!$A:$A,INDEX('Entities (norm)'!$A:$ZZ,0,MATCH("area_id",'Entities (norm)'!$1:$1,0)))
))
```

- G2 (labels)

```text
=ARRAYFORMULA(IF($A2:$A="","",
  XLOOKUP($A2:$A,'Entities (norm)'!$A:$A,INDEX('Entities (norm)'!$A:$ZZ,0,MATCH("labels",'Entities (norm)'!$1:$1,0)))
))
```

- H2 (customize) — leave blank for manual edits

```text
=ARRAYFORMULA(IF($A2:$A="","", ""))
```

- I2 (friendly_name) — prefer “name (raw)”, else “original_name”

```text
=ARRAYFORMULA(IF($A2:$A="","",
  IF(LEN($D2:$D),
    $D2:$D,
    XLOOKUP($A2:$A,'Entities (norm)'!$A:$A,INDEX('Entities (norm)'!$A:$ZZ,0,MATCH("original_name",'Entities (norm)'!$1:$1,0)))
  )
))
```

- J2 (icon) — fallback to original_icon

```text
=ARRAYFORMULA(IF($A2:$A="","",
  IFNA(
    XLOOKUP($A2:$A,'Entities (norm)'!$A:$A,INDEX('Entities (norm)'!$A:$ZZ,0,MATCH("icon",'Entities (norm)'!$1:$1,0))),
    XLOOKUP($A2:$A,'Entities (norm)'!$A:$A,INDEX('Entities (norm)'!$A:$ZZ,0,MATCH("original_icon",'Entities (norm)'!$1:$1,0)))
  )
))
```

- K2 (hidden) — TRUE if hidden_by or disabled_by present

```text
=ARRAYFORMULA(IF($A2:$A="","",
  (LEN(
    XLOOKUP($A2:$A,'Entities (norm)'!$A:$A,INDEX('Entities (norm)'!$A:$ZZ,0,MATCH("hidden_by",'Entities (norm)'!$1:$1,0)))
  )>0)
  +
  (LEN(
    XLOOKUP($A2:$A,'Entities (norm)'!$A:$A,INDEX('Entities (norm)'!$A:$ZZ,0,MATCH("disabled_by",'Entities (norm)'!$1:$1,0)))
  )>0) > 0
))
```

- L2 (YAML) — per-row snippet

```text
=ARRAYFORMULA(IF($A2:$A="","",
  "- entity_id: "&$A2:$A&CHAR(10)&
  "  name: "&IF(LEN($D2:$D),$D2:$D,$E2:$E)&
  IF(LEN($J2:$J),CHAR(10)&"  icon: "&$J2:$J,"")&
  IF(LEN($F2:$F),CHAR(10)&"  area_id: "&$F2:$F,"")
))
```

Notes:

- If the sheet uses Tables (typed columns), spill formulas may be blocked. Use
  the script’s prefill functions instead.

## Normalized sheet headers (TSV for A1)

- Areas (norm)

```csv
id,name,aliases,floor_id,icon
```

- Devices (norm)

```csv
id,name,name_by_user,manufacturer,model,area_id,via_device_id,entry_type,disabled_by,identifiers,labels,sw_version,hw_version
```

- Entities (norm)

```csv
entity_id,device_id,platform,name,original_name,area_id,hidden_by,disabled_by,labels,icon,original_icon,unit_of_measurement
```

- Floors (norm)

```csv
floor_id,name,level,icon,aliases,created_at,modified_at
```

- Labels (norm)

```csv
label_id,name,color,description,icon,created_at,modified_at
```

## Menu actions

- Sync All (Import + Prefill): imports CSVs, updates (norm), reconciles Derived
  rows, prefills Derived.
- Import All CSVs: imports only.
- Prefill Derived: area_id + labels: fills those two columns.
- Clear All Raw + Norm: clears raws and resets norms to headers.
