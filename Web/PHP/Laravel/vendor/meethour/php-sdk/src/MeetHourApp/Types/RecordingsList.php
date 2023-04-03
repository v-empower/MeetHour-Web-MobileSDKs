<?php
namespace MeetHourApp\Types;
class RecordingsList {
    public ?string $filter_by;
    public ?int $limit;
    public ?int $page;
    public function __construct(){
        $this->filter_by = null;
        $this->limit = null;
        $this->page = null;
    }
    public function prepare() {
        $recordingsListProperties = [
            "filter_by" => $this->filter_by,
            "limit" => $this->limit,
            "page" => $this->page
        ];
        foreach ($recordingsListProperties as $key => $value) {
            if ($value === null) {
              unset($recordingsListProperties[$key]);
            }
          }
        return $recordingsListProperties;
    }
}