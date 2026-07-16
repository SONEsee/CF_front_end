# DESIGN.md

ເອກະສານນີ້ບັນທຶກຮູບແບບ (convention) ການຂຽນໂຄດ ແລະ ອອກແບບ UI ທີ່ໃຊ້ຢູ່ໃນໂປເຈັກນີ້ ເພື່ອໃຫ້ component/ໜ້າໃໝ່ທີ່ຂຽນຕໍ່ໄປ ມີຄວາມສອດຄ່ອງກັບຂອງເກົ່າ.

## Stack

Nuxt 3 (Composition API) + Vuetify 3 + Pinia + TypeScript.

## 1. ໂຄງສ້າງ Component

- ໃຊ້ `<script lang="ts" setup>` ສະເໝີ, ຢູ່ເທິງ `<template>` (ບໍ່ໃຊ້ Options API)
- `<style>` block ໃຊ້ໜ້ອຍທີ່ສຸດ — ຕົກແຕ່ງຜ່ານ Vuetify props/utility classes ເປັນຫຼັກ, scoped style ໃຊ້ສະເພາະເວລາ Vuetify ເຮັດບໍ່ໄດ້ (ຕົວຢ່າງ: keyframe animation)
- Props: ໃຊ້ `defineProps({...})` object syntax ລະບຸ `type` / `required` / `default` ຊັດເຈນ
- Emits: ຄວນປະກາດຜ່ານ `defineEmits([...])` (ໃນໂຄດເກົ່າບາງບ່ອນ emit ຜ່ານ template ໂດຍກົງ, ບໍ່ຄວນເຮັດຕໍ່)
- Store: ໃຊ້ Pinia composable style `UseXxxStore()`, auto-import — ບໍ່ຕ້ອງ `import` ເອງ
- Component ຖືກ auto-import ຕາມ path folder → tag ຊື່ ເຊັ່ນ `components/Global/CardTitle.vue` → `<GlobalCardTitle />`
- Helper functions ໃຊ້ຊ້ຳ (auto-import): `goPath()`, `CallSwal()`, `DefaultSwalError()`, `formatnumber()`, `GetImageUrl()`, `GetDefaultStatus()`, `GetAgencyType()`, `GetItemPerPageOptions()`

## 2. ໂຕນສີ (Vuetify theme — `plugins/vuetify.ts`)

```ts
light: {
  dark: false,
  colors: {
    primary: colors.blue.darken2,        // ປຸ່ມ/action ຫຼັກ
    secondary: colors.amber.darken3,
    accent: colors.grey.darken3,
    info: colors.teal.lighten1,
    warning: colors.amber.base,          // ສະຖານະ "ປິດໃຊ້ງານ"
    error: colors.deepOrange.accent4,    // ປຸ່ມລຶບ/destructive
    success: colors.green.accent3,       // ສະຖານະ "ເປີດໃຊ້ງານ"
    background: '#fdfdf5',
  },
}
```

ໃຊ້ຄ່າ theme ເຫຼົ່ານີ້ (`color="primary"`, `color="error"`, ...) ແທນທີ່ຈະ hardcode hex ໃໝ່. ຄ່າ hardcode ເກົ່າທີ່ຍັງຄ້າງຢູ່ (`#E8E8E8`, `#2a9d8f`, `#3085d6`) ຖືວ່າເປັນ debt — ບໍ່ຄວນເພີ່ມໃໝ່.

## 3. Typography

- ຟອນ: **NotoSansLao** (Regular/Bold) ຈາກ `public/fonts/`, ປະກາດໃນ `assets/css/style.scss`, apply ໃສ່ `.v-application`/`body` global
- Label ຮູບແບບສອງພາສາ: `"ຊື່ ແລະ ນາມສະກຸນ / Fullname"` — ໃຫ້ຮັກສາຮູບແບບນີ້ໃນທຸກ field/heading ໃໝ່
- Heading ໃຊ້ tag ທຳມະດາ `<h3>`/`<h4>` ຫຼືຜ່ານ `<GlobalTextTitleLine title="..." />` (h3 + v-divider)
- Icon: `@mdi/font`, ໃຊ້ເປັນ string prop (`icon="mdi-pencil"`) ຫຼື `<v-icon>mdi-plus</v-icon>`

## 4. Spacing & Layout

- ໃຊ້ Vuetify utility classes ລ້ວນໆ: `pa-6`, `pb-6`, `mt-4`, `mb-7`, `ml-4`
- Flex: `d-flex flex-wrap justify-space-between align-center`
- Layout ຟອມ/ໜ້າ ໃຊ້ `v-row` / `v-col` grid (ຮູບແບບປົກກະຕິ: avatar column + 3 field column)

### ຮູບແບບ input field ມາດຕະຖານ (ໃຊ້ຊ້ຳໃນທຸກຟອມ)

```vue
<label>ຊື່ ແລະ ນາມສະກຸນ / Fullname</label>
<v-text-field
  v-model="form.name"
  variant="outlined"
  density="compact"
  hide-details="auto"
  class="pb-6"
  :rules="[(v) => !!v || 'ກະລຸນາປ້ອນຂໍ້ມູນ']"
/>
```

## 5. Pattern ໂມດູນ (Create / Edit / Detail / MainContent)

ທຸກໂມດູນ (Agency, Product, DeviceDistributions, ExpenseTypeManagements, ...) ໃຊ້ໂຄງສ້າງດຽວກັນ:

- **MainContent.vue** (ໜ້າ list): `GlobalTextTitleLine` ເປັນ header → search bar (`GlobalDebounceEventTextField`) → ປຸ່ມເພີ່ມ (`mdi-plus`, `color="primary"`) → `v-data-table` ມີ slot override ສຳລັບ `no`/ຮູບ/ສະຖານະ/ action icons (`mdi-pencil` ແກ້, `mdi-eye` ເບິ່ງ, `mdi-delete` ລຶບ, `variant="text" size="small"`) → `GlobalTablePaginations` ໃນ slot `bottom` (ບໍ່ໃຊ້ pager ມາດຕະຖານ Vuetify)
- **Create*.vue / Edit*.vue**: ຫໍ່ໃນ `<v-form ref="form">` → title + submit button ແຖວເທິງ → `v-row`/`v-col` grid ຟອມ → submit ດ້ວຍ `axios.post` (+ `FormData` ຖ້າມີຮູບ) → success ໃຊ້ `CallSwal()` (SweetAlert2) → `goPath()` ພາກັບຫຼັງຈາກ `setTimeout`
- **Detail*.vue**: ໃຊ້ `GlobalCardTitle` ສະແດງຂໍ້ມູນແບບ read-only (card ພື້ນສີເທົາອ່ອນ, rounded-lg)
- ຂໍ້ມູນສຳພັນ (nested record) ແຍກເປັນ dialog component ຕ່າງຫາກ, ຄວບຄຸມການເປີດ/ປິດຜ່ານ store boolean flag (ເຊັ່ນ `agencyStore.identity_request.dialog = true`)

## 6. Global Component Library (`components/Global/`)

| Component | Props | ໜ້າທີ່ |
|---|---|---|
| `CardTitle.vue` | `title`, `text` | label + read-only card (bg `#E8E8E8`, `rounded-lg`) |
| `DefaultStatusChip.vue` | `status: Number` | map 0/1 → chip ສີ warning/success + ຄຳລາວ |
| `TablePaginations.vue` | `page`, `limit`, `totalpage` | pagination custom (item-per-page select + v-pagination) |
| `TextTitleLine.vue` | `title` | `<h3>` + `<v-divider>` header ມາດຕະຖານ |
| `DebounceEventTextField.vue` | `input`, `label` | text field debounce 800ms |
| `LoadingIndicator.vue` | - | CSS bouncing-ball loader |
| `OverlayLoading.vue` | `loading: Boolean` | full-screen overlay ຄຸມ loading |

ໃຊ້ component ເຫຼົ່ານີ້ຊ້ຳກ່ອນສ້າງໃໝ່ ຖ້າ requirement ຄ້າຍຄືກັນ.

## ຂໍ້ຄວນລະວັງ (ບໍ່ຄວນເຮັດຕໍ່)

- ຫຼີກລ້ຽງການ hardcode hex ສີໃໝ່ ນອກ theme (`#E8E8E8`, `#2a9d8f`, ...) — ໃຫ້ໃຊ້ Vuetify theme token
- ຫຼີກລ້ຽງການ emit ຜ່ານ template ໂດຍກົງ ໂດຍບໍ່ປະກາດ `defineEmits`
- ຮັກສາ label ສອງພາສາ (ລາວ / English) ໃນທຸກ field ໃໝ່ໃຫ້ສອດຄ່ອງກັບຂອງເກົ່າ
