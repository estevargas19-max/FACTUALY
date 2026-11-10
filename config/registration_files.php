<?php
declare(strict_types=1);

return [
    'natural' => [
        ['key' => 'electronic_resolution', 'label' => 'Resolución de facturación electrónica vigente', 'required' => false, 'types' => ['application/pdf', 'image/jpeg', 'image/png'], 'max_size' => 10_485_760],
        ['key' => 'identity_front', 'label' => 'Foto de la cédula por el frente', 'required' => true, 'types' => ['image/jpeg', 'image/png'], 'max_size' => 5_242_880],
        ['key' => 'identity_back', 'label' => 'Foto de la cédula por el reverso', 'required' => true, 'types' => ['image/jpeg', 'image/png'], 'max_size' => 5_242_880],
    ],
    'legal' => [
        ['key' => 'rut', 'label' => 'RUT', 'required' => true, 'types' => ['application/pdf', 'image/jpeg', 'image/png'], 'max_size' => 10_485_760],
        ['key' => 'chamber_certificate', 'label' => 'Cámara de Comercio expedida hace menos de 30 días', 'required' => true, 'types' => ['application/pdf', 'image/jpeg', 'image/png'], 'max_size' => 10_485_760],
        ['key' => 'electronic_resolution', 'label' => 'Resolución de facturación electrónica vigente', 'required' => false, 'types' => ['application/pdf', 'image/jpeg', 'image/png'], 'max_size' => 10_485_760],
        ['key' => 'identity_front', 'label' => 'Foto de la cédula del representante legal por el frente', 'required' => true, 'types' => ['image/jpeg', 'image/png'], 'max_size' => 5_242_880],
        ['key' => 'identity_back', 'label' => 'Foto de la cédula del representante legal por el reverso', 'required' => true, 'types' => ['image/jpeg', 'image/png'], 'max_size' => 5_242_880],
    ],
];
