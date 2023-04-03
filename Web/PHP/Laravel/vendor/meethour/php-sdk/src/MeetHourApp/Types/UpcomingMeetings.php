<?php
namespace MeetHourApp\Types;
class UpcomingMeetings {
    public ?int $limit;
    public ?int $page;
    public ?int $show_all;

    public function __construct(){
        $this->limit = null;
        $this->page = null;
        $this->show_all = null;
    }
    public function prepare() {
        $upcomingMeetingsProperties = [
            "show_all" => $this->show_all,
            "limit" => $this->limit,
            "page" => $this->page
        ];
        foreach ($upcomingMeetingsProperties as $key => $value) {
            if ($value === null) {
              unset($upcomingMeetingsProperties[$key]);
            }
          }
        return $upcomingMeetingsProperties;
    }
}