--
-- Created by IntelliJ IDEA.
-- User: harold
-- Date: 17-7-12
-- Time: 上午11:43
-- To change this template use File | Settings | File Templates.
--

function setup_ice(input_sdp_name, output_pv_name)

    local input_sdp = sr.pv.get("$" .. input_sdp_name)
    sr.dbg("input sdp content: \n" .. input_sdp .. "\n")

    if not string.match(input_sdp, "a=ice") then
        sr.dbg("no ice parameters in the input sdp, skipping the rest.\n")
        return
    end

    local ice_ufrag
    local ice_pwd

    local is_session_level = true
    local is_first_m_audio = false
    local has_session_ice = false

    for line in string.gmatch(input_sdp, "[^\r\n]+") do
        if not has_session_ice then
            if is_session_level and string.match(line, "(a=ice)") then
                has_session_ice = true

            elseif is_session_level and string.match(line, "m=") then
                is_session_level = false
                is_first_m_audio = string.match(line, "(m=audio)") ~= nil

            elseif not is_session_level then
                if is_first_m_audio then
                    local t_ufrag = string.match(line, "(a=ice%-ufrag.*)")
                    if t_ufrag then
                        ice_ufrag = t_ufrag
                    end

                    local t_pwd = string.match(line, "(a=ice%-pwd.*)")
                    if t_pwd then
                        ice_pwd = t_pwd
                    end

                    if string.match(line, "(m=)") then
                        is_first_m_audio = false
                    end

                elseif string.match(line, "(m=audio)") then
                    is_first_m_audio = true
                end
            end
        end
    end

    if ice_ufrag then
        sr.dbg("ice_ufrag is: " .. ice_ufrag .. "\n")
    end

    if ice_pwd then
        sr.dbg("ice_pwd is: " .. ice_pwd .. "\n")
    end

    local new_sdp
    if not has_session_ice and ice_ufrag and ice_pwd then
        new_sdp = string.gsub(input_sdp, "m=", ice_ufrag .. "\r\n" .. ice_pwd .. "\r\nm=", 1)
    else
        new_sdp = input_sdp
    end

    sr.dbg("output new sdp content: \n" .. new_sdp .. "\n")

    sr.pv.sets("$" .. output_pv_name, new_sdp)
end


