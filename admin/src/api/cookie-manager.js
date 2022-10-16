
// Strapi
import { request } from "@strapi/helper-plugin"

const cookieManagerRequests = {
  getConfig: async () => {
    return await request(`/cookie-manager/config`, {
      method: "GET",
    })
  },
  updateConfig: async (data) => {
    return await request(`/cookie-manager/config/update`, {
      method: "PUT",
      body: { data: data },
    });
  },

  getLocales: async () => {
    return await request(`/cookie-manager/locales`, {
      method: "GET",
    })
  },

  getCookies: async (locale = null) => {
    return await request(`/cookie-manager/cookie/find${(locale) ? `?locale=${locale}` : ""}`, {
      method: "GET",
    })
  },
  createCookie: async (data) => {
    return await request(`/cookie-manager/cookie/create`, {
      method: "POST",
      body: { data: data },
    });
  },
  updateCookie: async (id, data) => {
    return await request(`/cookie-manager/cookie/update/${id}`, {
      method: "PUT",
      body: { data: data },
    });
  },
  deleteCookie: async (id) => {
    return await request(`/cookie-manager/cookie/delete/${id}`, {
      method: "DELETE",
    });
  },

  getCategories: async (locale = null) => {
    return await request(`/cookie-manager/cookie-category/find${(locale) ? `?locale=${locale}` : ""}`, {
      method: "GET",
    })
  },
  createCategory: async (data) => {
    return await request(`/cookie-manager/cookie-category/create`, {
      method: "POST",
      body: { data: data },
    });
  },
  updateCategory: async (id, data) => {
    return await request(`/cookie-manager/cookie-category/update/${id}`, {
      method: "PUT",
      body: { data: data },
    });
  },
  deleteCategory: async (id) => {
    return await request(`/cookie-manager/cookie-category/delete/${id}`, {
      method: "DELETE",
    });
  },

  getPopups: async (locale = null) => {
    return await request(`/cookie-manager/cookie-popup/find${(locale) ? `?locale=${locale}` : ""}`, {
      method: "GET",
    })
  },
  createPopup: async (data) => {
    return await request(`/cookie-manager/cookie-popup/create`, {
      method: "POST",
      body: { data: data },
    });
  },
  updatePopup: async (id, data) => {
    return await request(`/cookie-manager/cookie-popup/update/${id}`, {
      method: "PUT",
      body: { data: data },
    });
  },
  deletePopup: async (id) => {
    return await request(`/cookie-manager/cookie-popup/delete/${id}`, {
      method: "DELETE",
    });
  },
}

export default cookieManagerRequests