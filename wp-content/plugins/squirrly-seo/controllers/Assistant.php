<?php

class SQ_Controllers_Assistant extends SQ_Classes_FrontController {


    function init() {
        $tab = SQ_Classes_Helpers_Tools::getValue('tab', 'assistant');

        if (method_exists($this, $tab)) {
            call_user_func(array($this, $tab));
        }

        SQ_Classes_ObjController::getClass('SQ_Classes_DisplayController')->loadMedia('bootstrap-reboot');
        SQ_Classes_ObjController::getClass('SQ_Classes_DisplayController')->loadMedia('bootstrap');
        SQ_Classes_ObjController::getClass('SQ_Classes_DisplayController')->loadMedia('switchery');
        SQ_Classes_ObjController::getClass('SQ_Classes_DisplayController')->loadMedia('datatables');
        SQ_Classes_ObjController::getClass('SQ_Classes_DisplayController')->loadMedia('fontawesome');
        SQ_Classes_ObjController::getClass('SQ_Classes_DisplayController')->loadMedia('global');

        SQ_Classes_ObjController::getClass('SQ_Classes_DisplayController')->loadMedia('assistant');
        SQ_Classes_ObjController::getClass('SQ_Classes_DisplayController')->loadMedia('navbar');
        SQ_Classes_ObjController::getClass('SQ_Classes_DisplayController')->loadMedia('assistant');
        SQ_Classes_ObjController::getClass('SQ_Classes_DisplayController')->loadMedia('chart');

        //@ob_flush();
        echo $this->getView('Assistant/' . ucfirst($tab));

        //get the modal window for the assistant popup
        echo SQ_Classes_ObjController::getClass('SQ_Models_Assistant')->getModal();
    }

    public function assistant() {
    }

    public function settings() {
        $search = (string)SQ_Classes_Helpers_Tools::getValue('skeyword', '');
        $labels = SQ_Classes_Helpers_Tools::getValue('slabel', false);

        $args = array();
        $args['search'] = $search;
        if ($labels && !empty($labels)) {
            $args['label'] = join(',', $labels);
        }
        SQ_Debug::dump($args);

        $json = SQ_Classes_RemoteController::getBriefcase($args);

        $this->rankkeywords = SQ_Classes_RemoteController::getRanks();

        SQ_Debug::dump($json);

        if (isset($json->keywords) && !empty($json->keywords)) {
            $this->keywords = $json->keywords;
        } else {

            $this->error = __('No keyword found.', _SQ_PLUGIN_NAME_);

        }

        if (isset($json->labels)) {
            $this->labels = $json->labels;
        }

        wp_enqueue_style('wp-color-picker');
        wp_enqueue_script('wp-color-picker');
        SQ_Classes_ObjController::getClass('SQ_Classes_DisplayController')->loadMedia('briefcase');

    }


    /**
     * Called when action is triggered
     *
     * @return void
     */
    public function action() {

        parent::action();
        SQ_Classes_Helpers_Tools::setHeader('json');

        switch (SQ_Classes_Helpers_Tools::getValue('action')) {

            ///////////////////////////////////////////LIVE ASSISTANT SETTINGS
            case 'sq_settings_assistant':
                if (!current_user_can('sq_manage_settings')) {
                    return;
                }

                //Save the settings
                if (!empty($_POST)) {
                    SQ_Classes_ObjController::getClass('SQ_Models_Settings')->saveValues($_POST);
                }

                //show the saved message
                SQ_Classes_Error::setMessage(__('Saved', _SQ_PLUGIN_NAME_));

                break;

            case 'sq_ajax_assistant':
                if (!current_user_can('sq_manage_settings')) {
                    $response['error'] = SQ_Classes_Error::showNotices(__("You do not have permission to perform this action", _SQ_PLUGIN_NAME_), 'sq_error');
                    SQ_Classes_Helpers_Tools::setHeader('json');
                    echo json_encode($response);
                    exit();
                }

                SQ_Classes_Helpers_Tools::setHeader('json');

                $input = SQ_Classes_Helpers_Tools::getValue('input', '');
                $value = (bool)SQ_Classes_Helpers_Tools::getValue('value', false);
                if ($input) {
                    //unpack the input into expected variables
                    list($category_name, $name, $option) = explode('|', $input);
                    $dbtasks = json_decode(get_option(SQ_TASKS), true);

                    if ($category_name <> '' && $name <> '') {
                        if(!$option) $option = 'active';
                        $dbtasks[$category_name][$name][$option] = $value;
                        update_option(SQ_TASKS, json_encode($dbtasks));
                    }

                    $response['data'] = SQ_Classes_Error::showNotices(__('Saved', _SQ_PLUGIN_NAME_), 'sq_success');
                    echo json_encode($response);
                    exit;
                }

                $response['data'] = SQ_Classes_Error::showNotices(__('Error: Could not save the data.', _SQ_PLUGIN_NAME_), 'sq_error');
                echo json_encode($response);
                exit();



        }


    }
}
