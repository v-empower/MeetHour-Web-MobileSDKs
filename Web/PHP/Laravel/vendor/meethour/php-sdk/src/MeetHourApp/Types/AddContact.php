<?php
namespace MeetHourApp\Types;
class AddContact {
    public string $email;
    public string $firstname;
    public ?string $country_code;
    public ?string $image;
    public ?bool $is_show_portal;
    public ?string $lastname;
    public ?string $phone;

    public function __construct(string $email, string $firstname) {
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