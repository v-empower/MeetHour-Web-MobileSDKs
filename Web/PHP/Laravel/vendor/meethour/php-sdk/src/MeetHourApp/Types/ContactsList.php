<?php
namespace MeetHourApp\Types;

class ContactsList {
    public ?int $limit;
    public ?int $page;
    public ?int $exclude_hosts;

    public function __construct() {
        $this->limit = null;
        $this->page = null;
        $this->exclude_hosts = null;
    }
    public function prepare() {
        $contactsListProperties = [
            "limit" => $this->limit,
            "page" => $this->page,
            "exclude_hosts" => $this->exclude_hosts,
        ];
        foreach ($contactsListProperties as $key => $value) {
            if ($value === null) {
              unset($contactsListProperties[$key]);
            }
          }
        return $contactsListProperties;
    }
}