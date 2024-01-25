<template>
  <div class="container">
    <v-card class="px-4 py-2 login_card" style="width: 300px">
      <div v-if="loginForm">
        <h4 class="text-center my-3">Log in</h4>
        <v-form @submit.prevent="submitLoginForm" ref="login_form">
          <v-text-field
            variant="solo"
            v-model="email"
            density="compact"
            :rules="[
              (value) => !!value || 'Email is required',
              (value) =>
                /^\S+@\S+\.\S+$/.test(value) || 'Enter a valid email address',
            ]"
            label="Email"
          ></v-text-field>
          <v-text-field
            v-model="password"
            variant="solo"
            density="compact"
            class="mt-1"
            :rules="[
              (value) => !!value || 'Password is required',
              (value) =>
                value.length >= 6 || 'Password must be at least 6 characters',
            ]"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append-inner="showPassword = !showPassword"
            label="Password"
          ></v-text-field>
          <v-btn type="submit" block class="mb-3 mt-2 submit_btn">Login</v-btn>
          <p class="text-end click_section">
            click here for
            <span class="text-blue change_form_btn" @click="openRegister"
              >Register</span
            >
          </p>
        </v-form>
      </div>
      <div v-if="registerForm">
        <h4 class="text-center my-3">Register</h4>
        <v-form @submit.prevent="submitRegisterForm" ref="register_form">
          <v-text-field
            variant="solo"
            v-model="name"
            density="compact"
            :rules="[
              (value) => !!value || 'Name is required',
              (value) =>
                value.length >= 4 || 'Name must be at least 4 characters',
            ]"
            label="Name"
          ></v-text-field>
          <v-text-field
            variant="solo"
            v-model="email"
            density="compact"
            :rules="[
              (value) => !!value || 'Email name is required',
              (value) =>
                /^\S+@\S+\.\S+$/.test(value) || 'Enter a valid email address',
            ]"
            label="Email"
          ></v-text-field>
          <v-text-field
            v-model="password"
            variant="solo"
            density="compact"
            class="mt-1"
            :rules="[
              (value) => !!value || 'Password is required',
              (value) =>
                value.length >= 6 || 'Password must be at least 6 characters',
            ]"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append-inner="showPassword = !showPassword"
            label="Password"
          ></v-text-field>
          <v-text-field
            v-model="c_password"
            variant="solo"
            density="compact"
            class="mt-1"
            :rules="[
              (value) => !!value || 'Confirm Password is required',

              (value) =>
                value.length >= 6 ||
                'Confirm Password must be at least 6 characters',
              (value) => value === password || 'Password and Confirm not match',
            ]"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append-inner="showPassword = !showPassword"
            label="Confirm Password"
          ></v-text-field>
          <v-btn type="submit" block class="mb-3 mt-2 submit_btn"
            >Register</v-btn
          >
          <p class="text-end click_section">
            click here for
            <span class="text-blue change_form_btn" @click="openLogin"
              >Login</span
            >
          </p>
        </v-form>
      </div>
    </v-card>
  </div>
</template>
<script>
import { ref } from "vue";
import ApiServices from "../../ApiServices";
import { useRouter } from "vue-router";
export default {
  setup() {
    const email = ref("");
    const router = useRouter();
    const password = ref("");
    const c_password = ref("");
    const name = ref("");
    const isActive = ref(false);
    const loginForm = ref(true);
    const loginFormRef = ref(null);
    const registerForm = ref(false);
    const openRegister = () => {
      resetForm();
      loginForm.value = false;
      registerForm.value = true;
    };
    const openLogin = () => {
      resetForm();
      registerForm.value = false;
      loginForm.value = true;
    };
    const submitLoginForm = async () => {
      const obj = {
        email: email.value,
        password: password.value,
      };
      const { valid, errors } = await login_form.value.validate();
      if (valid) {
        try {
          const get_response = await ApiServices.loginUser(obj);
          console.log("find all data", get_response);

          if (get_response != undefined) {
            localStorage.setItem("token",get_response.data.data.token);
            router.push({ name: "about" });
          } else {
            alert("Email and password are not match");
            resetForm();
          }
        } catch (error) {
          if (error) {
            alert("Email and Password are not matching.");
          }
        }
      } 
    };
    const submitRegisterForm = async () => {
      const obj = {
        name:name.value,
        email: email.value,
        password: password.value,
        password_confirmation:c_password.value
      };
      const { valid, errors } = await register_form.value.validate();
      if (valid) {
        try {
          const get_response = await ApiServices.register(obj);
          console.log("find all data", get_response);
          alert(get_response.data.message);
          registerForm.value = false;
          loginForm.value = ture;
        } catch (error) {
          const value = error.response.data.data.email[0];
          if (value) {
            alert(value);
          }else{
            alert("Sonthing went to wrong")
          }
          resetForm();
        }
      } 
    };
    const resetForm = () => {
      email.value = "";
      password.value = "";
      c_password.value = "";
      name.value = "";
    };
    const login_form = ref(null);
    const register_form = ref(null);
    const showPassword = ref(false);
    return {
      email,
      password,
      name,
      c_password,
      registerForm,
      isActive,
      loginForm,
      login_form,
      register_form,
      resetForm,
      showPassword,
      openRegister,
      openLogin,
      submitLoginForm,
      submitRegisterForm
    };
  },
};
</script>
<style scoped>
.container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.change_form_btn {
  text-decoration: underline;
  cursor: pointer;
}
</style>