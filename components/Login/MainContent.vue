<template>
  <section
    style="min-height: 100vh"
    class="d-flex flex-wrap justify-center align-center"
  >
    <v-form ref="form" @submit.prevent="handleLogin">
      <v-card elevation="0" width="560px" class="pa-6">
        <v-row>
          <v-col cols="12">
            <div class="text-center">
              <v-avatar color="" size="150" border>
                <img src="../../assets/img/WhatsApp_Image_2026-07-14_at_16.23.19-removebg-preview.png" alt="" width="150">
              </v-avatar>
            </div>
            <h3 class="text-center">ເຂົ້າສູ່ລະບົບ ບໍລິສັດ ວີວີທີເອັສ ໂຊກໄຊຈະເລີນ ກໍ່ສ້າງ ຈຳກັດຜູ້ດຽວ</h3>
          </v-col>

          <v-col cols="12">
            <label>ຊື່ຜູ້ໃຊ້ງານ / Username</label>
            <v-text-field
              v-model="username"
              density="comfortable"
              variant="outlined"
              hide-details="auto"
              :rules="[(v: string) => !!v || 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ງານ']"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <label>ລະຫັດຜ່ານ / Password</label>
            <v-text-field
              v-model="password"
              :type="visible ? 'text' : 'password'"
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="visible = !visible"
              :rules="[(v: string) => !!v || 'Password is required']"
              density="comfortable"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-btn
              color="primary"
              type="submit"
              flat
              block
              height="40px"
              class="font-weight-black"
              :loading="loading"
            >
              ເຂົ້າສູ່ລະບົບ
            </v-btn>
          </v-col>
          <v-col cols="12" class="py-0 my-0">
            <div style="font-size: 10px">
              version: ທົດລອງ
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-form>
  </section>
</template>

<script lang="ts" setup>
import { UserStore } from "@/stores/user";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";

const username = ref(null);
const password = ref(null);
const visible = ref(false);
const form = ref();
const router = useRouter();
const route = useRoute();
const userStore = UserStore();
const loading = computed(() => userStore.login_loading);

const redirectPath = computed(() => {
  const redirect = route.query.redirect;
  const path = Array.isArray(redirect) ? redirect[0] : redirect;
  // ອະນຸຍາດສະເພາະ path ພາຍໃນເວັບ (ຂຶ້ນຕົ້ນດ້ວຍ "/" ດຽວ) ເພື່ອປ້ອງກັນ open-redirect
  return path && path.startsWith("/") && !path.startsWith("//") ? path : "/home";
});

const goPath = (path: string) => {
  router.push(path);
};

const handleLogin = async () => {
  try {
    const { valid } = await form.value.validate();
    if (!valid) return;

    const result = await userStore.Login({
      user_name: username.value ?? "",
      password: password.value ?? "",
    });

    if (result.success) {
      let timerInterval: ReturnType<typeof setInterval>;
      Swal.fire({
        icon: "success",
        title: "ສຳເລັດ",
        html: "ຈະເຂົ້າສູ່ໜ້າຫຼັກໃນ <b></b> ວິນາທີ.",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
          const htmlContainer = Swal.getHtmlContainer();
          if (htmlContainer) {
            const b = htmlContainer.querySelector("b");
            if (b) {
              timerInterval = setInterval(() => {
                const timerLeft = Swal.getTimerLeft();
                if (timerLeft !== undefined) {
                  b.textContent = Math.ceil(timerLeft / 1000).toString();
                }
              }, 100);
            }
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
          goPath(redirectPath.value);
        },
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "ເຂົ້າສູ່ລະບົບບໍ່ສຳເລັດ",
        text: result.message || "ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ",
      });
    }
  } catch (error: any) {
    console.error("Login error:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "ມີຂໍ້ຜິດພາດໃນການເຂົ້າສູ່ລະບົບ";
    Swal.fire({
      icon: "error",
      title: "ຂໍ້ຜິດພາດ",
      text: errorMessage,
    });
  }
};
</script>