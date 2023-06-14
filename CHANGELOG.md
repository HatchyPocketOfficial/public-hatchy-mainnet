# Changelog

## 2022-10-01

## :triangular_flag_on_post: Major Change

### Light To Dark Swap

There was a confusion with Light and Dark hatchies IDs. Gen2 contract is designed in a way that Light hatchies can be obtained only through Solar Eggs and Dark hatchies only through Lunar Eggs.  
Even so the website metadata has Light and Dark IDs swapped. This fix implies:

- Dark obtained hatchies so far will be swapped to Light hatchies with its corresponding ID
- Light hatchies will be swapped for the Dark hatchies.
- Users will keep the same amount of gen 2 tokens
- Water, Plant, Fire and Void hatchies keep the same ID

## :sparkles: New Features

### Gen 1 Batch Transfer

> **Warning**
> This is an experimental feature. Use at your own risk

Users were having problems to transfer multiple hatchies between their wallets.  
In order to make this task easier we implement a **batch transfer feature** for gen 1 only which gives users the ability to transfer up to 20 hatchies per transaction.
It is **accesible through wallet page** in non staked hatchies left side card.

### Gen 2 Detailed Staking View

New feature to stake gen 2 hatchies selecting both common and shiny amount.
We will keep the current functionaly which stakes all the available amount of selected hatchie.

## :memo: Changes

### Added

- Collection stats for both generations
- Gen 2 cards now display their respective hatchie ID

### Changed

- Update the heights and weights of hatchies with "Height: 11 cm  Weight: 11 kg"
- Change UI of gen2 claim card to make the amount obtained more perceptible
- Change Error and Warn toast messages
- Change Staking page texts and numbers displayed
- Change staking number formatting
- Update dragons and voids icons to show always shiny icon version
- Change text of some error/warning pages to show a hatchy gif
- Change leaf particles image

### Removed

- Disable referral edit when users have hatchies in staking

### Fixed

- Fix "Latest Hatched" not showing up in gen 2 claim section
- Fix Marketplace wrong number formatting
- Fix Gen2 shiny cards not displaying as shiny
- Fix Gen2 card images not showing correct ID
- Fix Staking icons not showing correct amount
