<?php
namespace MeetHourApp\Types;
class CompletedMeetings {
    public ?int $limit;
    public ?int $page;
    public ?int $show_all;

    public function __construct(){
        $this->limit = null;
        $this->page = null;
        $this->show_all = null;
    }
    public function prepare() {
        $completedMeetingsProperties = [
            "show_all" => $this->show_all,
            "limit" => $this->limit,
            "page" => $this->page
        ];
        foreach ($completedMeetingsProperties as $key => $value) {
            if ($value === null) {
              unset($completedMeetingsProperties[$key]);
            }
          }
        return $completedMeetingsProperties;
    }
}