<?php
namespace MeetHourApp\Types;

class EditContact {
    public int $contact_id;
    public string $firstname;
    public ?string $lastname;
    public ?string $phone;
    public ?string $country_code;
    public string $email;
    public ?string $image;
    public ?bool $is_show_portal;

    public function __construct(int $contact_id, string $firstname, string $email) {
        $this->contact_id = $contact_id;
        $this->email = $email;
        $this->firstname = $firstname;
        $this->country_code = null;
        $this->image = null;
        $this->is_show_portal = null;
        $this->lastname = null;
        $this->phone = null;
    }
    public function prepare() {
        $addContactProperties = [
            "contact_id" => $this->contact_id,
            "country_code" => $this->country_code,
            "email" => $this->email,
            "firstname" => $this->firstname,
            "image" => $this->image,
            "is_show_portal" => $this->is_show_portal,
            "lastname" => $this->lastname,
            "phone" => $this->phone,
        ];
        foreach ($addContactProperties as $key => $value) {
            if ($value === null) {
              unset($addContactProperties[$key]);
            }
          }
        return $addContactProperties;
    }
}