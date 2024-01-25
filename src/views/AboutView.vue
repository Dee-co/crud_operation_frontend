
<template>
  <div class="mx-4 pa-3">
    <div class="text-end my-2">
      <v-btn @click="openAddDialog" prepend-icon="mdi-plus-circle">
        <template v-slot:prepend>
          <v-icon color="success"></v-icon>
        </template>
        Add Product
      </v-btn>
      &nbsp;
      <v-btn @click="logout" prepend-icon="mdi-plus-circle">
        <template v-slot:prepend>
          <v-icon color="success"></v-icon>
        </template>
        Logout
      </v-btn>
    </div>
    <v-card>
      <v-table fixed-header v-if="products.length != 0">
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Description</th>
            <th class="text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.name">
            <td>{{ item.name }}</td>
            <td class="">{{ item.description }}</td>
            <td>
              <div class="d-flex align-center">
                <v-btn
                  icon
                  size="small"
                  color="success"
                  @click="editItem(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                &nbsp;
                <v-btn
                  icon
                  size="small"
                  color="#FF004D"
                  @click="deleteItem(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
      <p v-if="products.length == 0" class="text-center py-4">No data found</p>
    </v-card>
    <v-dialog
      transition="dialog-bottom-transition"
      v-model="openCategoryDialog"
      width="500"
    >
      <v-card>
        <v-toolbar color="primary" title="Add New Product"></v-toolbar>
        <div>
          <div class="pa-4">
            <v-form @submit.prevent="submitForm" ref="product_form">
              <v-text-field
                label="Name"
                density="compact"
                v-model="name"
                :rules="validationRules.name"
                name="name"
              ></v-text-field>
              <v-text-field
                label="Description"
                density="compact"
                v-model="description"
                :rules="validationRules.description"
                name="description"
              ></v-text-field>

              <v-btn
                :type="edit_category ? 'button' : 'submit'"
                @click="submitForm"
                variant="flat"
                size="small"
                color="#5865f2"
              >
                {{ !edit_category ? "Add" : "Edit" }}
              </v-btn>
              <v-btn
                @click="openCategoryDialog = false"
                variant="flat"
                size="small"
                color="#5865f2"
              >
                Close
              </v-btn>
            </v-form>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import ApiServices from "../../ApiServices";
export default {
  setup() {
    const product_form = ref(null);
    const openCategoryDialog = ref(false);
    const router = useRouter();
    const name = ref(null);
    const edit_category = ref(false);
    const description = ref(null);
    const validationRules = reactive({
      name: [(value) => !!value || "Name is required"],
      description: [(value) => !!value || "Description is required"],
    });
    onMounted(() => {
      check_authentication();
      getProducts();
    });
    const check_authentication = () => {
      const check_token = localStorage.getItem("token");
      if (check_token === null || check_token === undefined) {
        router.push({ name: "home" });
      }
    };
    const products = ref([]);

    const deleteItem = async (data) => {
      const userConfirmed = confirm(
        "Are you sure you want to delete this product?"
      );

      if (userConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const get_response = await ApiServices.deleteProduct(data.id, token);
          getProducts();
          alert(get_response.data.message);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      } else {
        // User clicked "Cancel," do not proceed with deletion
        alert("Deletion canceled by user.");
      }
    };

    const submitForm = async () => {
      const token = localStorage.getItem("token");
      const { valid, errors } = await product_form.value.validate();
      if (valid) {
        if (edit_category.value) {
          try {
            const edit_obj = {
              name: name.value,
              description: description.value,
            };
            const get_response = await ApiServices.updateProduct(
              edit_obj,
              edit_id.value,
              token
            );
            console.log(get_response);
            openCategoryDialog.value = false;
            getProducts();
            alert(get_response.data.message);
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        } else {
          try {
            const add_obj = {
              name: name.value,
              description: description.value,
            };
            const get_response = await ApiServices.addProduct(add_obj, token);
            console.log(get_response);
            openCategoryDialog.value = false;
            getProducts();
            alert(get_response.data.message);
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        }
      } else {
        alert("Form is not valid");
      }
    };
    const edit_id = ref(null);
    const token = ref(null);
    const editItem = (data) => {
      edit_id.value = data.id;
      name.value = data.name;
      description.value = data.description;
      edit_category.value = true;
      openCategoryDialog.value = true;
    };

    const openAddDialog = () => {
      name.value = null;
      description.value = null;
      edit_category.value = false; // Set to false for add operation
      openCategoryDialog.value = true;
    };
    const getProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const get_response = await ApiServices.getProducts(token);
        products.value = get_response.data.data;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    const logout = () => {
      localStorage.clear();
      router.push({ name: "home" });
    };
    return {
      products,
      edit_id,
      product_form,
      deleteItem,
      editItem,
      openAddDialog,
      token,
      submitForm,
      openCategoryDialog,
      name,
      description,
      edit_category,
      validationRules,
      check_authentication,
      getProducts,
      logout,
    };
  },
};
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>