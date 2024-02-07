import { GET_LEAVES_REQUEST,SAVE_LEAVES_REQUEST } from '../actions/actionTypes';
const initialState = {
    LeavesRequestList : []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {        
        case GET_LEAVES_REQUEST:
            return {
                ...state,
                LeavesRequestList: action.LeavesRequestList,            
            };   
            // case SAVE_LEAVES_REQUEST:
            // return {
            //     ...state,
            //     LeavesRequestList: action.LeavesRequestList,  
            // };        
        default:
            return state;
    };
};

export default reducer;