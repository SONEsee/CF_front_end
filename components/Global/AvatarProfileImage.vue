<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { UseGlobalStore } from "~/stores/global";
import notFoundImage from "@/assets/img/404.png";

const notFoundUrl = ref(notFoundImage);
const imageUrl = ref<string | null>(null); // ກຳນົດ type ໃຫ້ຊັດເຈນ
const globalStore = UseGlobalStore();

const props = defineProps({
  image_url: {
    type: String,
    required: false,
    default: "N/A",
  },
  size: {
    type: [String, Number],
    required: false,
    default: 220,
  },
});

const imageLink = computed(() => props.image_url ?? "N/A");

watch(
  imageLink,
  async (newVal) => {
    if (newVal && newVal !== "N/A") {
      try {
        const imageResponse = await globalStore.GetFileData(newVal);
        imageUrl.value = imageResponse || notFoundUrl.value;
      } catch (error) {
        console.error("Error fetching image:", error);
        imageUrl.value = notFoundUrl.value;
      }
    } else {
      imageUrl.value = notFoundUrl.value;
    }
  },
  { immediate: true }
);
</script>

<template>
  <v-avatar
    :size="size"
    class="mx-auto d-flex align-center"
    color="grey lighten-2"
  >
    <v-img
      alt="Image profile"
      :src="imageUrl || notFoundUrl"
    />
  </v-avatar>
</template>
