<?php
if (!function_exists('nominal')) {
    /**
     * Format angka menjadi format nominal.
     *
     * @param  float|int  $angka
     * @param  string  $nominal
     * @return string
     */
    function nominal($angka, $nominal = 'IDR')
    {
        if ($nominal == 'IDR') {
            return number_format($angka, 0, ',', '.');
        } elseif ($nominal == 'USD') {
            $kurs = 16536.88;
            return '$ ' . number_format($angka / $kurs, 2, '.', ',');
        }
    }
}
