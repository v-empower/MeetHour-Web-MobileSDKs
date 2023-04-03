<?php
namespace MeetHourApp\Types;
class ViewMeeting {
    public string $meeting_id;
    public function __construct(string $meeting_id){
        $this->meeting_id = $meeting_id;
    }
    public function prepare() {
        return [
            "meeting_id" => $this->meeting_id
        ];
    }
}