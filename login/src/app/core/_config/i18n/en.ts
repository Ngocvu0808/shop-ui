// USA
export const locale = {
    lang: 'en',
    data: {
        TRANSLATOR: {
            SELECT: 'Select your language',
        },
        MENU: {
            NEW: 'new',
            ACTIONS: 'Actions',
            CREATE_POST: 'Create New Post',
            PAGES: 'Pages',
            FEATURES: 'Features',
            APPS: 'Apps',
            DASHBOARD: 'Dashboard',
            SHORTEN_LINK: 'Shorten link',
            MANAGE_LINK: 'Manage Link',
            REPORTS: 'Reports'
        },
        COMMON: {
            BTN_SAVE: 'Save',
            BTN_CANCEL: 'Cancel',
            BTN_CONFIRM: 'Confirm',
            VIEW_DETAIL_TOOLTIP: 'View detail',
            EDIT_TOOLTIP: 'Edit',
            DELETE_TOOLTIP: 'Delete',
            COPY_TOOLTIP: 'Copy link',
            CANCEL_TOOLTIP: 'Cancel',
            SAVE_CHANGE_TOOLTIP: 'Save change',
            SEARCH_TOOTIP: 'Search',
        },
        AUTH: {
            GENERAL: {
                OR: 'Or',
                SUBMIT_BUTTON: 'Submit',
                NO_ACCOUNT: 'Don\'t have an account?',
                SIGNUP_BUTTON: 'Sign Up',
                FORGOT_BUTTON: 'Forgot Password',
                BACK_BUTTON: 'Back',
                PRIVACY: 'Privacy',
                LEGAL: 'Legal',
                CONTACT: 'Contact',
            },
            LOGIN: {
                TITLE: 'Login Account',
                BUTTON: 'Sign In',
            },
            FORGOT: {
                TITLE: 'Forgotten Password?',
                DESC: 'Enter your email to reset your password',
                SUCCESS: 'Your account has been successfully reset.'
            },
            REGISTER: {
                TITLE: 'Sign Up',
                DESC: 'Enter your details to create your account',
                SUCCESS: 'Your account has been successfuly registered.'
            },
            INPUT: {
                EMAIL: 'Email',
                FULLNAME: 'Fullname',
                PASSWORD: 'Password',
                CONFIRM_PASSWORD: 'Confirm Password',
                USERNAME: 'Username'
            },
            VALIDATION: {
                INVALID: '{{name}} is not valid',
                REQUIRED: '{{name}} is required',
                MIN_LENGTH: '{{name}} minimum length is {{min}}',
                AGREEMENT_REQUIRED: 'Accepting terms & conditions are required',
                NOT_FOUND: 'The requested {{name}} is not found',
                INVALID_LOGIN: 'The login detail is incorrect',
                REQUIRED_FIELD: 'Required field',
                MIN_LENGTH_FIELD: 'Minimum field length:',
                MAX_LENGTH_FIELD: 'Maximum field length:',
                INVALID_FIELD: 'Field is not valid',
            }
        },
        ECOMMERCE: {
            COMMON: {
                SELECTED_RECORDS_COUNT: 'Selected records count: ',
                ALL: 'All',
                SUSPENDED: 'Suspended',
                ACTIVE: 'Active',
                FILTER: 'Filter',
                BY_STATUS: 'by Status',
                BY_TYPE: 'by Type',
                BUSINESS: 'Business',
                INDIVIDUAL: 'Individual',
                SEARCH: 'Search',
                IN_ALL_FIELDS: 'in all fields'
            },
            ECOMMERCE: 'eCommerce',
            CUSTOMERS: {
                CUSTOMERS: 'Customers',
                CUSTOMERS_LIST: 'Customers list',
                NEW_CUSTOMER: 'New Customer',
                DELETE_CUSTOMER_SIMPLE: {
                    TITLE: 'Customer Delete',
                    DESCRIPTION: 'Are you sure to permanently delete this customer?',
                    WAIT_DESCRIPTION: 'Customer is deleting...',
                    MESSAGE: 'Customer has been deleted'
                },
                DELETE_CUSTOMER_MULTY: {
                    TITLE: 'Customers Delete',
                    DESCRIPTION: 'Are you sure to permanently delete selected customers?',
                    WAIT_DESCRIPTION: 'Customers are deleting...',
                    MESSAGE: 'Selected customers have been deleted'
                },
                UPDATE_STATUS: {
                    TITLE: 'Status has been updated for selected customers',
                    MESSAGE: 'Selected customers status have successfully been updated'
                },
                EDIT: {
                    UPDATE_MESSAGE: 'Customer has been updated',
                    ADD_MESSAGE: 'Customer has been created'
                }
            }
        },
        PAGINATOR: {
            ITEMS_PER_PAGE_LABEL: 'Items per pages',
            NEXT_PAGE_LABEL: 'Next pages',
            PREVIOUS_PAGE_LABEL: 'Previous pages',
            FIRST_PAGE_LABEL: 'First pages',
            LAST_PAGE_LABEL: 'Last pages',
            OF_LABEL: 'of'
        },
        SHORT_LINK: {
            CREATE_LINK: {
                TITLE: 'Rút gọn link',
                LONG_LINK: 'Link gốc',
                TYPE_LINK: 'Type link',
                LONG_LINK_REQUIRED: 'Link gốc không được để trống',
                LONG_LINK_INVALID: 'Link gốc không hợp lệ',
                LONG_LINK_MAX_LENGTH: 'Link gốc không được dài quá 2048 ký tự',
                TYPE_REQUIRED: 'Type không được để trống',
                ADVANCED_BUTTON_LABEL: 'Advanced',
                DOMAIN: 'Domain',
                BRAND: 'Brand name',
                DURATION: 'Thời hạn',
                BETWEEN: 'Trong khoảng',
                EXACTLY: 'Đến',
                MONTH: 'Tháng',
                DATE: 'Ngày',
                HOUR: 'Giờ',
                MINUTE: 'Phút',
                DATE_REQUIRED: 'Ngày không được để trống',
                DATE_INVALID: 'Ngày giờ không được nhỏ hơn hiện tại',
                HOUR_VALIDATE_PATTERN: 'Giờ phải là số tự nhiên',
                HOUR_VALIDATE_MIN: 'Giờ phải thuộc khoảng 00-23',
                HOUR_VALIDATE_MAX: 'Giờ phải thuộc khoảng 00-23',
                MINUTE_VALIDATE_PATTERN: 'Phút phải là số tự nhiên',
                MINUTE_VALIDATE_MIN: 'Phút phải thuộc khoảng 00-59',
                MINUTE_VALIDATE_MAX: 'Phút phải thuộc khoảng 00-59',
                DURATION_VALIDATE_REQUIRED: 'Thời hạn không được để trống',
                DURATION_VALIDATE_PATTERN: 'Thời hạn phải là số tự nhiên',
                DURATION_VALIDATE_MIN: 'Thời hạn phải lớn hơn 0',
                DURATION_VALIDATE_MAX: 'Thời hạn phải nhỏ hơn 10,000',
                LIMIT_CONVERT: 'Giới hạn chuyển đổi',
                LIMIT_CONVERT_REQUIRED: 'Giới hạn chuyển đổi không được để trống',
                LIMIT_CONVERT_PATTERN: 'Giới hạn chuyển đổi phải là số tự nhiên',
                LIMIT_CONVERT_MIN: 'Giới hạn phải lớn hơn 0',
                LIMIT_CONVERT_MAX: 'Giới hạn phải nhỏ hơn 10,000,000,000',
                TURNS: 'Lượt',
                SHORT_LINK_BUTTON_LABEL: 'Rút gọn link',
                DATE_INPUT_INVALID: 'Ngày không hợp lệ',
                FAIL_MSG_BEFORE: 'Rút gọn link',
                FAIL_MSG_AFTER: ' thất bại',
                SUCCESS_FORM_TITLE: 'Link rút gọn',
                SUCCESS_FORM_COPY_BTN_LABEL: 'Sao chép link',
                COPY_MSG: 'Đã copy vào bộ nhớ đệm'
            },
            EDIT_LINK: {
                TITLE: 'Chỉnh sửa link rút gọn',
                DATE: 'Ngày',
                HOUR: 'Giờ',
                MINUTE: 'Phút',
                DATE_REQUIRED: 'Ngày không được để trống',
                DATE_TIME_INVALID: 'Ngày giờ không được nhỏ hơn hiện tại',
                HOUR_VALIDATE_PATTERN: 'Giờ phải là số tự nhiên',
                HOUR_VALIDATE_MIN: 'Giờ phải thuộc khoảng 00-23',
                HOUR_VALIDATE_MAX: 'Giờ phải thuộc khoảng 00-23',
                MINUTE_VALIDATE_PATTERN: 'Phút phải là số tự nhiên',
                MINUTE_VALIDATE_MIN: 'Phút phải thuộc khoảng 00-59',
                MINUTE_VALIDATE_MAX: 'Phút phải thuộc khoảng 00-59',
                LIMIT_CONVERT: 'Giới hạn chuyển đổi',
                LIMIT_CONVERT_PATTERN: 'Giới hạn chuyển đổi phải là số tự nhiên',
                LIMIT_CONVERT_MIN: 'Giới hạn phải lớn hơn 0',
                LIMIT_CONVERT_MAX: 'Giới hạn phải nhỏ hơn 10,000,000,000',
                SAVE_BUTTON_LABEL: 'Lưu',
                SAVE_BUTTON_TOOLTIP: 'Lưu thay đổi',
                CLOSE_BUTTON_LABEL: 'Đóng',
                CLOSE_BUTTON_TOOLTIP: 'Hủy',
                SUCCESS_MSG: 'Sửa thành công',
                ERROR_MSG: 'Có lỗi xảy ra',
                DATE_INPUT_INVALID: 'Ngày không hợp lệ',
                NO_CHANGE: 'Không có gì thay đổi',
            },
            MANAGE_LINK: {
                TITLE: 'Quản lý link rút gọn',
                SEARCH_LABEL: 'Tìm kiếm',
                SEARCH_PLACEHOLDER: 'Tìm kiếm link rút gọn',
                SHORT_LINK: 'Link rút gọn',
                TIME_CREATED: 'Thời gian tạo',
                TYPE: 'Type',
                TIME_EXPIRED: 'Thời gian hết hạn',
                LIMIT_CONVERT: 'Giới hạn',
                CONVERT: 'Chuyển đổi',
                ACTIONS: 'Thao tác',
                COPY_MSG: 'Đã copy vào bộ nhớ đệm',
                URL_INVALID: 'URL không khả dụng',
                EXCEPTION_MSG: 'Có lỗi xảy ra',
                NO_RECORDS_FOUND: 'Không có dữ liệu'
            },
            DETAIL: {
                TITLE: 'Chi tiết link rút gọn',
                LONG_LINK: 'Link gốc',
                SHORT_LINK: 'Link rút gọn',
                TIME_CREATED: 'Thời gian tạo',
                CREATOR_NAME: 'Người thực hiện',
                TYPE: 'Type',
                DOMAIN: 'Domain',
                BRAND_NAME: 'Brand name',
                TIME_EXPIRED: 'Thời gian hết hạn',
                LIMIT_CONVERT: 'Giới hạn chuyển đổi',
                CONVERTED: 'Đã chuyển đổi',
                CLOSE_BUTTON_LABEL: 'Đóng',
                CLOSE_BUTTON_TOOLTIP: 'Hủy'
            },
            REPORTS: {
                TITLE: 'Báo cáo',
                FROM_DATE: 'Link rút gọn - Từ ngày',
                TO_DATE: 'Link rút gọn - Đến ngày',
                FILTER_BY: 'Lọc theo',
                TYPE_LINK: 'type',
                STATUS: 'trạng thái',
                EXPIRED: 'Hết hạn',
                UN_EXPIRED: 'Còn hạn',
                SEARCH_LABEL: 'Tìm kiếm...',
                SEARCH_PLACEHOLDER: 'Tìm kiếm link rút gọn',
                VIEW_REPORT_LABEL: 'Xem báo cáo',
                INDEX: 'STT',
                SHORT_LINK: 'Link rút gọn',
                ACCESSED_NUM: 'Lượt truy cập',
                CONVERTED_NUM: 'Lượt chuyển đổi',
                CONVERSION_RATE: 'Conversion rate',
                LIMIT_REMAINING: 'Giới hạn còn',
                TIME_REMAINING: 'Thời gian còn',
                FROM_DATE_GT_CURRENT: 'Ngày từ không được lớn hơn ngày hiện tại',
                TO_DATE_GT_CURRENT: 'Ngày đến không được lớn hơn ngày hiện tại',
                FROM_DATE_GT_TO_DATE: 'Ngày đến phải lớn hơn hoặc bằng ngày từ',
                DATE_INPUT_INVALID: 'Ngày không hợp lệ',
                NO_RECORDS_FOUND: 'Không có dữ liệu'
            }
        }
    }
};