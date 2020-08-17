/*
The MIT License (MIT)

Copyright (c) 2012-2020 [Muaz Khan](https://github.com/muaz-khan)

<<<<<<< HEAD
	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	*/
// Sourced from: https://cdn.webrtc-experiment.com/CodecsHandler.js
=======
    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
    the Software, and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
    FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
    COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
    IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    */
	
// Sourced from: https://cdn.webrtc-experiment.com/CodecsHandler.js

// *FILE HAS BEEN HEAVILY MODIFIED BY STEVE SEGUIN. ALL RIGHTS RESERVED WHERE APPLICABLE *

>>>>>>> upstream/master
var CodecsHandler = (function() {
    function preferCodec(sdp, codecName) {
        var info = splitLines(sdp);

        if (!info.videoCodecNumbers) {
            return sdp;
        }

        if (codecName === 'vp8' && info.vp8LineNumber === info.videoCodecNumbers[0]) {
            return sdp;
        }

        if (codecName === 'vp9' && info.vp9LineNumber === info.videoCodecNumbers[0]) {
            return sdp;
        }

        if (codecName === 'h264' && info.h264LineNumber === info.videoCodecNumbers[0]) {
            return sdp;
        }

        sdp = preferCodecHelper(sdp, codecName, info);

        return sdp;
    }

    function preferCodecHelper(sdp, codec, info, ignore) {
        var preferCodecNumber = '';

        if (codec === 'vp8') {
            if (!info.vp8LineNumber) {
                return sdp;
            }
            preferCodecNumber = info.vp8LineNumber;
        }

        if (codec === 'vp9') {
            if (!info.vp9LineNumber) {
                return sdp;
            }
            preferCodecNumber = info.vp9LineNumber;
        }

        if (codec === 'h264') {
            if (!info.h264LineNumber) {
                return sdp;
            }

            preferCodecNumber = info.h264LineNumber;
        }

        var newLine = info.videoCodecNumbersOriginal.split('SAVPF')[0] + 'SAVPF ';

        var newOrder = [preferCodecNumber];

        if (ignore) {
            newOrder = [];
        }

        info.videoCodecNumbers.forEach(function(codecNumber) {
            if (codecNumber === preferCodecNumber) return;
            newOrder.push(codecNumber);
        });

        newLine += newOrder.join(' ');

        sdp = sdp.replace(info.videoCodecNumbersOriginal, newLine);
        return sdp;
    }

    function splitLines(sdp) {
        var info = {};
        sdp.split('\n').forEach(function(line) {
            if (line.indexOf('m=video') === 0) {
                info.videoCodecNumbers = [];
                line.split('SAVPF')[1].split(' ').forEach(function(codecNumber) {
                    codecNumber = codecNumber.trim();
                    if (!codecNumber || !codecNumber.length) return;
                    info.videoCodecNumbers.push(codecNumber);
                    info.videoCodecNumbersOriginal = line;
                });
            }

            if (line.indexOf('VP8/90000') !== -1 && !info.vp8LineNumber) {
                info.vp8LineNumber = line.replace('a=rtpmap:', '').split(' ')[0];
            }

            if (line.indexOf('VP9/90000') !== -1 && !info.vp9LineNumber) {
                info.vp9LineNumber = line.replace('a=rtpmap:', '').split(' ')[0];
            }

            if (line.indexOf('H264/90000') !== -1 && !info.h264LineNumber) {
                info.h264LineNumber = line.replace('a=rtpmap:', '').split(' ')[0];
            }
        });

        return info;
    }
<<<<<<< HEAD

    function removeVPX(sdp) {
        var info = splitLines(sdp);

        // last parameter below means: ignore these codecs
        sdp = preferCodecHelper(sdp, 'vp9', info, true);
        sdp = preferCodecHelper(sdp, 'vp8', info, true);

        return sdp;
=======
    
    function extractSdp(sdpLine, pattern) {
        var result = sdpLine.match(pattern);
        return (result && result.length == 2)? result[1]: null;
>>>>>>> upstream/master
    }

    function disableNACK(sdp) {
        if (!sdp || typeof sdp !== 'string') {
            throw 'Invalid arguments.';
        }

        sdp = sdp.replace('a=rtcp-fb:126 nack\r\n', '');
        sdp = sdp.replace('a=rtcp-fb:126 nack pli\r\n', 'a=rtcp-fb:126 pli\r\n');
        sdp = sdp.replace('a=rtcp-fb:97 nack\r\n', '');
        sdp = sdp.replace('a=rtcp-fb:97 nack pli\r\n', 'a=rtcp-fb:97 pli\r\n');

        return sdp;
    }

<<<<<<< HEAD
    function prioritize(codecMimeType, peer) {
        if (!peer || !peer.getSenders || !peer.getSenders().length) {
            return;
        }

        if (!codecMimeType || typeof codecMimeType !== 'string') {
            throw 'Invalid arguments.';
        }

        peer.getSenders().forEach(function(sender) {
            var params = sender.getParameters();
            for (var i = 0; i < params.codecs.length; i++) {
                if (params.codecs[i].mimeType == codecMimeType) {
                    params.codecs.unshift(params.codecs.splice(i, 1));
                    break;
                }
            }
            sender.setParameters(params);
        });
    }

    function removeNonG722(sdp) {
        return sdp.replace(/m=audio ([0-9]+) RTP\/SAVPF ([0-9 ]*)/g, 'm=audio $1 RTP\/SAVPF 9');
    }

    function setBAS(sdp, bandwidth, isScreen) {
        if (!bandwidth) {
            return sdp;
        }

        if (typeof isFirefox !== 'undefined' && isFirefox) {
            return sdp;
        }

        if (isScreen) {
            if (!bandwidth.screen) {
                console.warn('It seems that you are not using bandwidth for screen. Screen sharing is expected to fail.');
            } else if (bandwidth.screen < 300) {
                console.warn('It seems that you are using wrong bandwidth value for screen. Screen sharing is expected to fail.');
            }
        }

        // if screen; must use at least 300kbs
        if (bandwidth.screen && isScreen) {
            sdp = sdp.replace(/b=AS([^\r\n]+\r\n)/g, '');
            sdp = sdp.replace(/a=mid:video\r\n/g, 'a=mid:video\r\nb=AS:' + bandwidth.screen + '\r\n');
        }

        // remove existing bandwidth lines
        if (bandwidth.audio || bandwidth.video) {
            sdp = sdp.replace(/b=AS([^\r\n]+\r\n)/g, '');
        }

        if (bandwidth.audio) {
            sdp = sdp.replace(/a=mid:audio\r\n/g, 'a=mid:audio\r\nb=AS:' + bandwidth.audio + '\r\n');
        }

        if (bandwidth.screen) {
            sdp = sdp.replace(/a=mid:video\r\n/g, 'a=mid:video\r\nb=AS:' + bandwidth.screen + '\r\n');
        } else if (bandwidth.video) {
            sdp = sdp.replace(/a=mid:video\r\n/g, 'a=mid:video\r\nb=AS:' + bandwidth.video + '\r\n');
        }

        return sdp;
    }

=======
  
>>>>>>> upstream/master
    // Find the line in sdpLines that starts with |prefix|, and, if specified,
    // contains |substr| (case-insensitive search).
    function findLine(sdpLines, prefix, substr) {
        return findLineInRange(sdpLines, 0, -1, prefix, substr);
    }

    // Find the line in sdpLines[startLine...endLine - 1] that starts with |prefix|
    // and, if specified, contains |substr| (case-insensitive search).
    function findLineInRange(sdpLines, startLine, endLine, prefix, substr) {
        var realEndLine = endLine !== -1 ? endLine : sdpLines.length;
        for (var i = startLine; i < realEndLine; ++i) {
            if (sdpLines[i].indexOf(prefix) === 0) {
                if (!substr ||
                    sdpLines[i].toLowerCase().indexOf(substr.toLowerCase()) !== -1) {
                    return i;
                }
            }
        }
        return null;
    }

    // Gets the codec payload type from an a=rtpmap:X line.
    function getCodecPayloadType(sdpLine) {
        var pattern = new RegExp('a=rtpmap:(\\d+) \\w+\\/\\d+');
        var result = sdpLine.match(pattern);
        return (result && result.length === 2) ? result[1] : null;
    }

<<<<<<< HEAD
    function setVideoBitrates(sdp, params) {
        params = params || {};
        var xgoogle_min_bitrate = params.min;
        var xgoogle_max_bitrate = params.max;

        var sdpLines = sdp.split('\r\n');

        // VP8
        var vp8Index = findLine(sdpLines, 'a=rtpmap', 'VP8/90000');
        var vp8Payload;
        if (vp8Index) {
            vp8Payload = getCodecPayloadType(sdpLines[vp8Index]);
        }

        if (!vp8Payload) {
=======
    function getVideoBitrates(sdp) { 

		var defaultBitrate = 2500;

        var sdpLines = sdp.split('\r\n');
        var mLineIndex = findLine(sdpLines, 'm=', 'video');
        if (mLineIndex === null) {
            return defaultBitrate;
        }
        var videoMLine = sdpLines[mLineIndex];
        var pattern = new RegExp('m=video\\s\\d+\\s[A-Z/]+\\s');
        var sendPayloadType = videoMLine.split(pattern)[1].split(' ')[0];
        var fmtpLine = sdpLines[findLine(sdpLines, 'a=rtpmap', sendPayloadType)];
        var codec = fmtpLine.split('a=rtpmap:' + sendPayloadType)[1].split('/')[0];

        var codecIndex = findLine(sdpLines, 'a=rtpmap', codec+'/90000');
        var codecPayload;
        if (codecIndex) {
            codecPayload = getCodecPayloadType(sdpLines[codecIndex]);
        }

        if (!codecPayload) {
            return defaultBitrate;
        }

        var rtxIndex = findLine(sdpLines, 'a=rtpmap', 'rtx/90000');
        var rtxPayload;
        if (rtxIndex) {
            rtxPayload = getCodecPayloadType(sdpLines[rtxIndex]);
        }

        if (!rtxIndex) {
            return defaultBitrate;
        }

        var rtxFmtpLineIndex = findLine(sdpLines, 'a=fmtp:' + rtxPayload.toString());
        if (rtxFmtpLineIndex !== null) {
            try {
                var maxBitrate = parseInt(sdpLines[rtxFmtpLineIndex].split("x-google-max-bitrate=")[1].split(";")[0]);
                var minBitrate = parseInt(sdpLines[rtxFmtpLineIndex].split("x-google-min-bitrate=")[1].split(";")[0]);
            } catch(e){
                return defaultBitrate;
            }
           
           if (minBitrate>maxBitrate){
               maxBitrate = minBitrate;
           }
           if (maxBitrate<1){maxBitrate=1;}
           return maxBitrate
        } else {
            return defaultBitrate;
        }

        
        
    }

    function setVideoBitrates(sdp, params, codec) {  // modified + Improved by Steve.
        
        if (codec){
            codec = codec.toUpperCase();
        } else{
            codec="VP8";
        }
        
        var sdpLines = sdp.split('\r\n');

        // Search for m line.
        var mLineIndex = findLine(sdpLines, 'm=', 'video');
        if (mLineIndex === null) {
            return sdp;
        }
        // Figure out the first codec payload type on the m=video SDP line.
        var videoMLine = sdpLines[mLineIndex];
        var pattern = new RegExp('m=video\\s\\d+\\s[A-Z/]+\\s');
        var sendPayloadType = videoMLine.split(pattern)[1].split(' ')[0];
        var fmtpLine = sdpLines[findLine(sdpLines, 'a=rtpmap', sendPayloadType)];
        var codecName = fmtpLine.split('a=rtpmap:' + sendPayloadType)[1].split('/')[0];
        
        codec = codecName || codec; // Try to find first Codec; else use expected/default
        
        params = params || {};
        var xgoogle_min_bitrate = params.min.toString();
        var xgoogle_max_bitrate = params.max.toString();

        var codecIndex = findLine(sdpLines, 'a=rtpmap', codec+'/90000');
        var codecPayload;
        if (codecIndex) {
            codecPayload = getCodecPayloadType(sdpLines[codecIndex]);
        }

        if (!codecPayload) {
>>>>>>> upstream/master
            return sdp;
        }

        var rtxIndex = findLine(sdpLines, 'a=rtpmap', 'rtx/90000');
        var rtxPayload;
        if (rtxIndex) {
            rtxPayload = getCodecPayloadType(sdpLines[rtxIndex]);
        }

        if (!rtxIndex) {
            return sdp;
        }

        var rtxFmtpLineIndex = findLine(sdpLines, 'a=fmtp:' + rtxPayload.toString());
        if (rtxFmtpLineIndex !== null) {
            var appendrtxNext = '\r\n';
<<<<<<< HEAD
            appendrtxNext += 'a=fmtp:' + vp8Payload + ' x-google-min-bitrate=' + (xgoogle_min_bitrate || '228') + '; x-google-max-bitrate=' + (xgoogle_max_bitrate || '228');
=======
            appendrtxNext += 'a=fmtp:' + codecPayload + ' x-google-min-bitrate=' + (xgoogle_min_bitrate || '2500') + '; x-google-max-bitrate=' + (xgoogle_max_bitrate || '2500');
>>>>>>> upstream/master
            sdpLines[rtxFmtpLineIndex] = sdpLines[rtxFmtpLineIndex].concat(appendrtxNext);
            sdp = sdpLines.join('\r\n');
        }

        return sdp;
    }

<<<<<<< HEAD
    function setOpusAttributes(sdp, params) {
=======
    function setOpusAttributes(sdp, params) { 
>>>>>>> upstream/master
        params = params || {};

        var sdpLines = sdp.split('\r\n');

<<<<<<< HEAD
        // Opus
=======
>>>>>>> upstream/master
        var opusIndex = findLine(sdpLines, 'a=rtpmap', 'opus/48000');
        var opusPayload;
        if (opusIndex) {
            opusPayload = getCodecPayloadType(sdpLines[opusIndex]);
        }

        if (!opusPayload) {
            return sdp;
        }

        var opusFmtpLineIndex = findLine(sdpLines, 'a=fmtp:' + opusPayload.toString());
        if (opusFmtpLineIndex === null) {
            return sdp;
        }

        var appendOpusNext = '';
<<<<<<< HEAD
        appendOpusNext += '; stereo=' + (typeof params.stereo != 'undefined' ? params.stereo : '1');
        appendOpusNext += '; sprop-stereo=' + (typeof params['sprop-stereo'] != 'undefined' ? params['sprop-stereo'] : '1');

        if (typeof params.maxaveragebitrate != 'undefined') {
            appendOpusNext += '; maxaveragebitrate=' + (params.maxaveragebitrate || 128 * 1024 * 8);
        }

        if (typeof params.maxplaybackrate != 'undefined') {
            appendOpusNext += '; maxplaybackrate=' + (params.maxplaybackrate || 128 * 1024 * 8);
        }

        if (typeof params.cbr != 'undefined') {
            appendOpusNext += '; cbr=' + (typeof params.cbr != 'undefined' ? params.cbr : '1');
        }

        if (typeof params.useinbandfec != 'undefined') {
            appendOpusNext += '; useinbandfec=' + params.useinbandfec;
        }

        if (typeof params.usedtx != 'undefined') {
            appendOpusNext += '; usedtx=' + params.usedtx;
        }

        if (typeof params.maxptime != 'undefined') {
            appendOpusNext += '\r\na=maxptime:' + params.maxptime;
        }
=======
		
		// Please see https://tools.ietf.org/html/rfc7587 for more details on OPUS settings
		
		if (typeof params.maxptime != 'undefined') {  // max packet size in milliseconds
            appendOpusNext += ';maxptime:' + params.maxptime; // 3, 5, 10, 20, 40, 60 and the default is 120. (20 is minimum recommended for webrtc)
        }
		
		if (typeof params.ptime != 'undefined') {  // packet size; webrtc doesn't support less than 10 or 20 I think.
            appendOpusNext += ';ptime:' + params.ptime; 
        }
		
		if (typeof params.stereo != 'undefined'){
			if (params.stereo==0){
				appendOpusNext += ';stereo=0;sprop-stereo=0';  // defaults to 0
			} else if (params.stereo==1){
				appendOpusNext += ';stereo=1;sprop-stereo=1'; // defaults to 0
			} else if (params.stereo==2){
				sdpLines[opusIndex] = sdpLines[opusIndex].replace("opus/48000/2", "multiopus/48000/6");
				appendOpusNext += ';channel_mapping=0,4,1,2,3,5;num_streams=4;coupled_streams=2';  // Multi-channel 5.1 audio
			}
		}
		
        if (typeof params.maxaveragebitrate != 'undefined') {
            appendOpusNext += ';maxaveragebitrate=' + params.maxaveragebitrate; // default 2500 (kbps)
        }

        if (typeof params.maxplaybackrate != 'undefined') {
            appendOpusNext += ';maxplaybackrate=' + params.maxplaybackrate; // Default should be 48000 (hz) , 8000 to 48000 are valid options
        }

        if (typeof params.cbr != 'undefined') {
            appendOpusNext += ';cbr=' + params.cbr; // default is 0 (vbr)
        }

        //if (typeof params.useinbandfec != 'undefined') {  // useful for handling packet loss
        //    appendOpusNext += '; useinbandfec=' + params.useinbandfec;  // Defaults to 0
        //}

        if (typeof params.usedtx != 'undefined') {  // Default is 0
            appendOpusNext += ';usedtx=' + params.usedtx; // if decoder prefers the use of DTX.
        }

        
>>>>>>> upstream/master

        sdpLines[opusFmtpLineIndex] = sdpLines[opusFmtpLineIndex].concat(appendOpusNext);

        sdp = sdpLines.join('\r\n');
<<<<<<< HEAD
        return sdp;
    }

    // forceStereoAudio => via webrtcexample.com
    // requires getUserMedia => echoCancellation:false
    function forceStereoAudio(sdp) {
        var sdpLines = sdp.split('\r\n');
        var fmtpLineIndex = null;
        for (var i = 0; i < sdpLines.length; i++) {
            if (sdpLines[i].search('opus/48000') !== -1) {
                var opusPayload = extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
                break;
            }
        }
        for (var i = 0; i < sdpLines.length; i++) {
            if (sdpLines[i].search('a=fmtp') !== -1) {
                var payload = extractSdp(sdpLines[i], /a=fmtp:(\d+)/);
                if (payload === opusPayload) {
                    fmtpLineIndex = i;
                    break;
                }
            }
        }
        if (fmtpLineIndex === null) return sdp;
        sdpLines[fmtpLineIndex] = sdpLines[fmtpLineIndex].concat('; stereo=1; sprop-stereo=1');
        sdp = sdpLines.join('\r\n');
        return sdp;
    }

    return {
        removeVPX: removeVPX,
        disableNACK: disableNACK,
        prioritize: prioritize,
        removeNonG722: removeNonG722,
        setApplicationSpecificBandwidth: function(sdp, bandwidth, isScreen) {
            return setBAS(sdp, bandwidth, isScreen);
        },
        setVideoBitrates: function(sdp, params) {
            return setVideoBitrates(sdp, params);
=======
		
        return sdp;
    }

	
    return {
        disableNACK: disableNACK,
        
		getVideoBitrates: function(sdp) {
            return getVideoBitrates(sdp);
        },
		
        setVideoBitrates: function(sdp, params, codec) {
            return setVideoBitrates(sdp, params, codec);
>>>>>>> upstream/master
        },
        setOpusAttributes: function(sdp, params) {
            return setOpusAttributes(sdp, params);
        },
<<<<<<< HEAD
        preferVP9: function(sdp) {
            return preferCodec(sdp, 'vp9');
        },
        preferCodec: preferCodec,
        forceStereoAudio: forceStereoAudio
    };
})();

// backward compatibility
window.BandwidthHandler = CodecsHandler;
=======

        preferCodec: preferCodec
    };
})();

>>>>>>> upstream/master
