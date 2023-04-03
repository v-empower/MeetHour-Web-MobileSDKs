<?php
namespace MeetHourApp\Services;

use GuzzleHttp\Client;
use \GuzzleHttp\Exception\GuzzleException;
use \GuzzleHttp\RequestOptions;
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

class MHApiService {
    private const BASE_URL = 'https://api.meethour.io';
    private const API_VERSION = 'v1.2';

    private $httpClient;
    private static $accessToken;

    public function __construct() {
        $this->httpClient = new Client([
            'base_uri' => self::BASE_URL
        ]);
    }

    private static function apiEndpointUrl(string $endpoint): string {
        switch ($endpoint) {
            case 'login':
                return self::BASE_URL . '/oauth/token';
            case 'add_contact':
                return self::BASE_URL . '/api/' . self::API_VERSION . '/customer/addcontact';
            case 'contacts_list':
                return self::BASE_URL . '/api/' . self::API_VERSION . '/customer/contacts';
            case 'schedule_meeting':
                return self::BASE_URL . '/api/' . self::API_VERSION . '/meeting/schedulemeeting';
            case 'get_jwt':
                return self::BASE_URL . '/api/' . self::API_VERSION . '/getjwt';
            case 'upcoming_meeting':
                return self::BASE_URL . '/api/' . self::API_VERSION . '/meeting/upcomingmeetings';
            case 'timezone':
                return self::BASE_URL . '/api/' . self::API_VERSION . '/getTimezone';
            case 'recordings_list':
                return self::BASE_URL . '/api/' . self::API_VERSION . '/customer/videorecordinglist';
            case 'edit_meeting':
                return self::BASE_URL . '/api/' . self::API_VERSION . '/meeting/editmeeting';
            case 'edit_contact':
                return self::BASE_URL . '/api/' . self::API_VERSION . '/customer/editcontact';
            case 'view_meeting':
                return self::BASE_URL . '/api/' . self::API_VERSION . '/meeting/viewmeeting';
            case 'archive_meeting':
                return self::BASE_URL . '/api/' . self::API_VERSION . '/meeting/archivemeeting';
            case 'missed_meetings':
                return self::BASE_URL . '/api/' . self::API_VERSION . '/meeting/missedmeetings';
            case 'completed_meetings':
                return self::BASE_URL . '/api/' . self::API_VERSION . '/meeting/completedmeetings';
            case 'user_details':
                return self::BASE_URL . '/api/' . self::API_VERSION . '/customer/user_details';
            case 'refresh_token':
                return self::BASE_URL . '/oauth/token';
            default:
                throw new \Exception('Invalid endpoint');
        }
    }

    private static function substitutePathParameter(string $url, array $pathParam = []): string {
        foreach ($pathParam as $item) {
            $url = str_replace('{' . $item['key'] . '}', $item['value'] ?? '', $url);
        }

        return $url;
    }

    private static function getHeaders(string $token): array {
        return [
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $token,
        ];
    }

    /**
     * postFetch() : For making Post HTTP Methods via Guzzle HTTP Client
     * @param string $token endpoint End Point types.
     * @param string $endpoint  endpoint End Point types.
     * @param array  $body API call body.
     * @param array $pathParam  endpoint End Point types.
     * @return mixed response data that we get from API
    **/
         private static function postFetch(string $token, string $endpoint, array $body, array $pathParam = []) {
        $constructedUrl = self::substitutePathParameter(
            self::apiEndpointUrl($endpoint),
            $pathParam
        );
        try {
            $client = new Client();
            $response = $client->post($constructedUrl, [
                'headers' => self::getHeaders($token),
                'json' => $body
            ]);
            if ($response->getStatusCode() >= 400 && $response->getStatusCode() < 600) {
                echo 'Bad response from server.', $response->getBody();
                return null;
            }
            return json_decode($response->getBody());
        } catch (\Exception $error) {
            echo $error;
        }
    }


    /**
     * login(): To authenticate and login to get access token
     * @param Login $loginObject Grant Type. Accepts "password"
     * @return mixed response data that we get from API.
     */
    public function login(Login $loginObject) {
        $body = $loginObject->prepare();
        return self::postFetch('', 'login', $body);
    }

    /**
     * getRefreshToken(): To get new token from refresh token
     * @param string $token access token to make API calls.
     * @param RefreshToken $refreshTokenObject API call body.
     * @return mixed response data that we get from API.
     */
    public static function getRefreshToken(string $token, RefreshToken $refreshTokenObject) {
        $body = $refreshTokenObject->prepare();
        return self::postFetch($token, 'refresh_token', $body);
    }

    /**
     * userDetails(): For making Post HTTP Methods via Guzzle.
     * @param string $token access token to make API calls.
     * @return mixed response data that we get from API.
     */
    public static function userDetails(string $token) {
        return self::postFetch($token, 'user_details', []);
    }

     /**
     * generateJwt() : JWT is needed to join the meeting with user information. Usually used if Moderator is joining.
     * @param string $token - access token to make API calls.
     * @param GenerateJwt $generateJwtObject - API call body.
     * @return mixed response data that we get from API.
     */
    public static function generateJwt($token, GenerateJwt $generateJwtObject) {
        $body = $generateJwtObject->prepare();
        return self::postFetch($token, 'get_jwt', $body);
    }

    /**
     * addContact() : To add contact in Meet Hour Database.
     * @param string $token - access token to make API calls.
     * @param AddContact $addContactObject - API call body.
     * @return mixed response data that we get from API.
     */
    public static function addContact($token, AddContact $addContactObject) {
        $body = $addContactObject->prepare();
        return self::postFetch($token, 'add_contact', $body);
    }

    /**
     * timezone() : To get all the timezones used in Meet Hour while Meeting is being Scheduled.
     * @param string $token - access token to make API calls.
     * @return mixed response data that we get from API.
     */
    public static function timezone($token) {
        return self::postFetch($token, 'timezone', []);
    }

    /**
     * contactsList() : To get all the contacts available on Meet Hour account.
     * @param string $token - access token to make API calls.
     * @param ContactsList $contactsListObject - API call body.
     * @return mixed response data that we get from API.
     */
    public static function contactsList($token, ContactsList $contactsListObject) {
        $body = $contactsListObject->prepare();
        return self::postFetch($token, 'contacts_list', $body);
    }

    /**
     * editContact() : To edit a specific contact.
     * @param string $token - access token to make API calls.
     * @param EditContact $editContactObject - API call body.
     * @return mixed response data that we get from API.
     */
    public static function editContact($token, EditContact $editContactObject) {
        $body = $editContactObject->prepare();
        return self::postFetch($token, 'edit_contact', $body);
    }

    
    /**
     * scheduleMeeting() : Function to hit a Schedule Meeting API.
     * @param string $token - access token to make API calls.
     * @param ScheduleMeeting $scheduleMeetingObject - API call body.
     * @return mixed response data that we get from API.
     */
    public static function scheduleMeeting($token, ScheduleMeeting $scheduleMeetingObject)
    {
        $body = $scheduleMeetingObject->prepare();
        return self::postFetch($token, 'schedule_meeting', $body);
    }

    /**
     * upcomingMeetings() : Function to hit a Schedule Meeting API.
     * @param string $token - access token to make API calls.
     * @param UpcomingMeetings $upcomingMeetingsObject - API call body.
     * @return mixed response data that we get from API.
     */
    public static function upcomingMeetings($token, UpcomingMeetings $upcomingMeetingsObject)
    {
        $body = $upcomingMeetingsObject->prepare();
        return self::postFetch($token, 'upcoming_meeting', $body);
    }

    /**
     * archiveMeeting() : To get archive Meeting
     * @param string $token - access token to make API calls.
     * @param ArchiveMeeting $archiveMeeting - API call body.
     * @return mixed response data that we get from API.
     */
    public static function archiveMeeting($token, ArchiveMeeting $archiveMeeting)
    {
        $body = $archiveMeeting->prepare();
        return self::postFetch($token, 'archive_meeting', $body);
    }

    /**
     * missedMeetings() : To get all the Missed Meeting.
     * @param string $token - access token to make API calls.
     * @param MissedMeetings $missedMeetingsObject - API call body.
     * @return mixed response data that we get from API.
     */
    public static function missedMeetings($token, MissedMeetings $missedMeetingsObject)
    {
        $body = $missedMeetingsObject->prepare();
        return self::postFetch($token, 'missed_meetings', $body);
    }

    /**
     * completedMeetings() : To get all the Completed Meetings.
     * @param string $token - access token to make API calls.
     * @param CompletedMeetings $completedMeetings - API call body.
     * @return mixed respos$e data that we get from API.
     */
    public static function completedMeetings($token, CompletedMeetings $completedMeetings)
    {
        $body = $completedMeetings->prepare();
        return self::postFetch($token, 'completed_meetings', $body);
    }

  /**
 * editMeeting() : To Edit a specific meeting.
 * @param string $token - access token to make API calls.
 * @param EditMeeting $editMeetingObject - API call body.
 * @return mixed response data that we get from API.
 */
    public static function editMeeting($token, EditMeeting $editMeetingObject) {
        $body = $editMeetingObject->prepare();
        return self::postFetch($token, 'edit_meeting', $body);
    }

    /**
 * viewMeeting() : To get information of specific meeting.
 * @param string $token - access token to make API calls.
 * @param ViewMeeting $viewMeetingObject - API call body.
 * @return mixed response data that we get from API.
 */
public static function viewMeeting(string $token, ViewMeeting $viewMeetingObject) {
        $body = $viewMeetingObject->prepare();
        return self::postFetch($token, 'view_meeting', $body);
    }

    /**
 * recordingsList() : To get all the recording list.
 * @param string $token - access token to make API calls.
 * @param RecordingsList $recordingsListObject - API call body.
 * @return mixed response data that we get from API.
 */
public static function recordingsList(string $token, RecordingsList $recordingsListObject) {
        $body = $recordingsListObject->prepare();
        return self::postFetch($token, 'recordings_list', $body);
    }

}