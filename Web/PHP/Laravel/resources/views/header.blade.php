<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />

    <link href="https://portal.meethour.io/dist/images/favicon.png" rel="shortcut icon" />
    <title>Meet Hour - Laravel Example</title>
   <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
   <link href="{{ asset('css/style.css') }}" rel="stylesheet">
   <link href="{{ asset('css/loader.css') }}" rel="stylesheet">
   <script src="{{ asset('js/joinMeeting.js') }}"></script>
   <script src="{{ asset('js/scheduleMeeting.js') }}"></script>
</head>

