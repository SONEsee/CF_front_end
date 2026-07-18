<script lang="ts" setup>
const emit = defineEmits(["setinput"]);

defineProps<{
  input?: string | null;
  label: string;
}>();

const onDebounceInput = useDebounceFn((value: string) => {
  emit("setinput", value);
}, 800);
</script>

<template>
  <section>
    <label v-if="label" class="d-block mb-2">{{ label }}</label>
    <v-text-field
      variant="outlined"
      hide-details
      density="compact"
      clearable
      :model-value="input"
      @update:model-value="onDebounceInput"
    ></v-text-field>
  </section>
</template>
