<?php
if (!defined('IN_CB')) { die('You are not allowed to access to this page.'); }

$imageKeys = array();
function registerImageKey($key, $value) {
    global $imageKeys;
    $imageKeys[$key] = $value;
}

function getImageKeys() {
    global $imageKeys;
    return $imageKeys;
}

function getElementHtml($tag, $attributes, $content = false) {
    $code = '<' . $tag;
    foreach ($attributes as $attribute => $value) {
        $code .= ' ' . $attribute . '="' . $value . '"';
    }

    if ($content === false || $content === null) {
        $code .= ' />';
    } else {
        $code .= '>' . $content . '</' . $tag . '>';
    }

    return $code;
}

function getInputTextHtml($name, $currentValue, $attributes = array()) {
    $defaultAttributes = array(
        'id' => $name,
        'name' => $name
    );

    $finalAttributes = array_merge($defaultAttributes, $attributes);
    if ($currentValue !== null) {
        $finalAttributes['value'] = $currentValue;
    }

    return getElementHtml('input', $finalAttributes, false);
}

function getOptionHtml($value, $content, $attributes = array()) {
    $defaultAttributes = array(
        'value' => $value
    );

    $finalAttributes = array_merge($defaultAttributes, $attributes);

    return getElementHtml('option', $finalAttributes, $content);
}

function getSelectHtml($name, $currentValue, $options, $attributes = array()) {
    $defaultAttributes = array(
        'size' => 1,
        'id' => $name,
        'name' => $name
    );

    $finalAttributes = array_merge($defaultAttributes, $attributes);
    $content = "";
    foreach ($options as $optionKey => $optionValue) {
        $optionAttributes = array();
        if ($currentValue === $optionKey) {
            $optionAttributes['selected'] = 'selected';
        }
        $content .= getOptionHtml($optionKey, $optionValue, $optionAttributes);
    }

    return getElementHtml('select', $finalAttributes, $content);
}

function getCheckboxHtml($name, $currentValue, $attributes = array()) {
    $defaultAttributes = array(
        'type' => 'checkbox',
        'id' => $name,
        'name' => $name,
        'value' => isset($attributes['value']) ? $attributes['value'] : 'On'
    );

    $finalAttributes = array_merge($defaultAttributes, $attributes);
    if ($currentValue == $finalAttributes['value']) {
        $finalAttributes['checked'] = 'checked';
    }

    return getElementHtml('input', $finalAttributes, false);
}

function getButton($value, $output = null) {
    $escaped = false;
    $finalValue = $value[0] === '&' ? $value : htmlentities($value);
    if ($output === null) {
        $output = $value;
    } else {
        $escaped = true;
    }

    $code = '<input type="button" value="' . $finalValue . '" data-output="' . $output . '"' . ($escaped ? ' data-escaped="true"' : '') . ' />';
    return $code;
}

/**
 * Returns the fonts available for drawing.
 *
 * @return string[]
 */
function listfonts($folder) {
    $array = array();
    if (($handle = opendir($folder . '/font')) !== false) {
        while (($file = readdir($handle)) !== false) {
            if(substr($file, -4, 4) === '.ttf') {
                $array[$file] = $file;
            }
        }
    }
    closedir($handle);

    array_unshift($array, 'No Label');

    return $array;
}
?>