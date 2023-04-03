<?php
namespace MeetHourApp\Types;

class ArchiveMeeting {
    public string $id;
    public function __construct(string $id) {
        $this->id = $id;
    }
    public function prepare() {
        return [
            "id" => $this->id
        ];
    }
}