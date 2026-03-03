// src/features/admin/services/adminUsersService.js
import { supabase } from "../../../lib/supabase/supabaseClient";

const adminUsersService = {
  async createAdminUser({ email, password, displayName }) {
    const { data, error } = await supabase.functions.invoke(
      "create-auth-user",
      {
        body: { email, password, displayName },
      }
    );

    if (error) {
      // erro de invocação da edge function (problema de rede, etc.)
      throw new Error(error.message || "Could not call create-admin function");
    }

    if (data?.error) {
      // erro retornado pela própria function
      throw new Error(data.error);
    }

    return true;
  },
};

export default adminUsersService;
