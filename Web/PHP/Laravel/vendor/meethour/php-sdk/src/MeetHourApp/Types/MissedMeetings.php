<?php
namespace MeetHourApp\Types;
class MissedMeetings {
    public ?int $limit;
    public ?int $page;
    public ?int $show_all;

    public function __construct(){
        $this->limit = null;
        $this->page = null;
        $this->show_all = null;
    }
    public function prepare() {
        $missedMeetingsProperties = [
            "show_all" => $this->show_all,
            "limit" => $this->limit,
            "page" => $this->page
        ];
        foreach ($missedMeetingsProperties as $key => $value) {
            if ($value === null) {
              unset($missedMeetingsProperties[$key]);
            }
          }
        return $missedMeetingsProperties;
    }
}