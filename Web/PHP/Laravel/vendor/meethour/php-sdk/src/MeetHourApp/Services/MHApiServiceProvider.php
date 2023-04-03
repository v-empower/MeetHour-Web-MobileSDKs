<?php

namespace MeetHourApp\Services;

use Illuminate\Support\ServiceProvider;
use MeetHourApp\Types\ScheduleMeeting;
use MeetHourApp\Types\AddContact;
use MeetHourApp\Types\ArchiveMeeting;
use MeetHourApp\Types\CompletedMeetings;
use MeetHourApp\Types\ContactsList;
use MeetHourApp\Types\EditContact;
use MeetHourApp\Types\EditMeeting;
use MeetHourApp\Types\GenerateJwt;
use MeetHourApp\Types\Login;
use MeetHourApp\Types\MissedMeetings;
use MeetHourApp\Types\RecordingsList;
use MeetHourApp\Types\RefreshToken;
use MeetHourApp\Types\UpcomingMeetings;
use MeetHourApp\Types\ViewMeeting;

/**
 * Class PasswordServiceProvider
 */
class MHApiServiceProvider extends ServiceProvider
{
    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('MeetHourApp\/Services', MHApiService::class);
        $this->app->singleton('MeetHourApp\/Types', ScheduleMeeting::class);
        $this->app->singleton('MeetHourApp\/Types', Login::class);
        $this->app->singleton('MeetHourApp\/Types', AddContact::class);
        $this->app->singleton('MeetHourApp\/Types', ArchiveMeeting::class);
        $this->app->singleton('MeetHourApp\/Types', CompletedMeetings::class);
        $this->app->singleton('MeetHourApp\/Types', ContactsList::class);
        $this->app->singleton('MeetHourApp\/Types', EditContact::class);
        $this->app->singleton('MeetHourApp\/Types', EditMeeting::class);
        $this->app->singleton('MeetHourApp\/Types', GenerateJwt::class);
        $this->app->singleton('MeetHourApp\/Types', Login::class);
        $this->app->singleton('MeetHourApp\/Types', MissedMeetings::class);
        $this->app->singleton('MeetHourApp\/Types', RecordingsList::class);
        $this->app->singleton('MeetHourApp\/Types', RefreshToken::class);
        $this->app->singleton('MeetHourApp\/Types', UpcomingMeetings::class);
        $this->app->singleton('MeetHourApp\/Types', ViewMeeting::class);
    }
}
