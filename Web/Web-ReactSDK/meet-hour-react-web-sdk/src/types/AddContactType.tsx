export default interface AddContactType {
    firstname: string,
    lastname?: string,
    email: string,
    phone?: string,
    country_code?: string,
    image?: string,
    is_show_portal?: boolean
  }